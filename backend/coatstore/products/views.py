from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db.models import F
from .models import Product, Order, OrderItem, Cart, CartItem, Size
from .serializers import (
    ProductSerializer,
    OrderSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    CartSerializer,
    CartItemSerializer
)
from django.contrib.auth import authenticate, login  # Импортируем login
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend

# Класс фильтрации для продуктов
class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')  # Минимальная цена
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')  # Максимальная цена
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')  # Поиск по названию
    size = filters.ModelMultipleChoiceFilter(
        field_name="sizes",
        queryset=Size.objects.all()
    )  # Фильтр по размерам

    class Meta:
        model = Product
        fields = ['min_price', 'max_price', 'name', 'size']

# Представление для списка продуктов
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # Доступно всем
    filter_backends = [DjangoFilterBackend]  # Включаем фильтрацию
    filterset_class = ProductFilter  # Подключаем класс фильтрации

# Представление для создания товара
class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]  # Только администраторы

# Представление для обновления товара
class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]  # Только администраторы

# Представление для удаления товара
class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]  # Только администраторы

# Представление для списка заказов
class OrderListView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только авторизованные пользователи

    def perform_create(self, serializer):
        # Устанавливаем текущего пользователя как автора заказа
        serializer.save(customer=self.request.user)

# Представление для деталей заказа
class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только авторизованные пользователи

# Регистрация нового пользователя
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]  # Доступно всем

# Авторизация пользователя
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]  # Доступно всем

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)  # Создаем сессию для пользователя
                user_serializer = UserSerializer(user)
                return Response(user_serializer.data)
            return Response({'error': 'Invalid credentials'}, status=400)
        return Response(serializer.errors, status=400)

# Представление для получения корзины
class CartView(APIView):
    def get(self, request):
        # Если пользователь авторизован, ищем корзину по пользователю
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            # Если пользователь не авторизован, ищем корзину по сессии
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

# Представление для добавления товара в корзину
class AddToCartView(APIView):
    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        # Проверяем, есть ли такой продукт
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product does not exist'}, status=status.HTTP_404_NOT_FOUND)
        # Находим корзину пользователя
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        # Добавляем товар в корзину
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if created:
            # Если товар только что создан, устанавливаем количество равным переданному значению
            cart_item.quantity = quantity
        else:
            # Если товар уже существует, увеличиваем количество на переданное значение
            cart_item.quantity += quantity
        # Проверяем, чтобы количество товара не превышало доступный запас
        if cart_item.quantity > product.stock:
            return Response(
                {'error': f'Not enough stock for {product.name}. Available: {product.stock}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Сохраняем изменения
        cart_item.save()
        return Response({'message': 'Item added to cart', 'quantity': cart_item.quantity})

# Представление для удаления товара из корзины
class RemoveFromCartView(APIView):
    def delete(self, request, cart_item_id):
        try:
            cart_item = CartItem.objects.get(id=cart_item_id)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item does not exist'}, status=status.HTTP_404_NOT_FOUND)

# Представление для создания заказа из корзины
class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Только авторизованные пользователи

    def post(self, request):
        # Находим корзину пользователя
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        # Проверяем, есть ли товары в корзине
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        # Создаем заказ
        order = Order.objects.create(customer=request.user)
        # Добавляем товары из корзины в заказ
        total_price = 0
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity
            )
            total_price += cart_item.product.price * cart_item.quantity
        # Устанавливаем общую сумму заказа
        order.total_price = total_price
        order.save()
        # Очищаем корзину
        cart.items.all().delete()
        # Возвращаем созданный заказ
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Представление для обновления статуса заказа
class UpdateOrderStatusView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]  # Только администраторы

    def update(self, request, *args, **kwargs):
        # Разрешаем частичное обновление, чтобы можно было передать только поле status
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        new_status = self.request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            serializer.save(status=new_status)
        else:
            raise ValidationError({'status': 'Invalid status'})