from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db.models import F
from .models import (
    Product, Order, OrderItem, Cart, CartItem, Size, Category, Color,
    PromoCode, Favorite, RecentlyViewed, Profile
)
from .serializers import (
    ProductSerializer, OrderSerializer, UserRegistrationSerializer,
    UserLoginSerializer, UserSerializer, CartSerializer, CartItemSerializer,
    PromoCodeSerializer, ProfileSerializer
)
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.utils import timezone

# Фильтрация продуктов с поддержкой категории, цветов, поиска по sku, имени, описанию и размеров
class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')
    sku = filters.CharFilter(field_name="sku", lookup_expr='icontains')
    category = filters.NumberFilter(field_name="category__id", lookup_expr='exact')
    colors = filters.ModelMultipleChoiceFilter(
        field_name="colors", queryset=Color.objects.all()
    )
    sizes = filters.ModelMultipleChoiceFilter(
        field_name="sizes", queryset=Size.objects.all()
    )
    description = filters.CharFilter(field_name="description", lookup_expr='icontains')
    
    class Meta:
        model = Product
        fields = ['min_price', 'max_price', 'name', 'sku', 'category', 'colors', 'sizes', 'description']

# Список продуктов с сортировкой (по умолчанию по цене по возрастанию)
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().select_related('category').prefetch_related('sizes', 'colors')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ProductFilter
    ordering_fields = ['price']
    ordering = ['price']

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

# Эндпоинт для похожих товаров: товары из той же категории, исключая текущий товар
class SimilarProductsView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        if product.category:
            similar = Product.objects.filter(category=product.category).exclude(id=product.id).select_related('category').prefetch_related('sizes', 'colors')
        else:
            similar = Product.objects.exclude(id=product.id).select_related('category').prefetch_related('sizes', 'colors')
        serializer = ProductSerializer(similar, many=True)
        return Response(serializer.data)

# Эндпоинт для записи просмотра товара (для аутентифицированных пользователей)
class RecordProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        RecentlyViewed.objects.update_or_create(
            user=request.user,
            product=product,
            defaults={'viewed_at': timezone.now()}
        )
        return Response({'message': 'Product view recorded'}, status=status.HTTP_200_OK)

# Эндпоинт для получения недавно просмотренных товаров
class RecentlyViewedListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        recent = RecentlyViewed.objects.filter(user=self.request.user)
        product_ids = recent.values_list('product__id', flat=True)
        return Product.objects.filter(id__in=product_ids).select_related('category').prefetch_related('sizes', 'colors')

# Заказы: для не-администраторов возвращаются только заказы текущего пользователя
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().prefetch_related('items__product__category', 'items__product__sizes', 'items__product__colors')
        return Order.objects.filter(customer=user).prefetch_related('items__product__category', 'items__product__sizes', 'items__product__colors')

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all().prefetch_related('items__product__category', 'items__product__sizes', 'items__product__colors')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                user_serializer = UserSerializer(user)
                return Response(user_serializer.data)
            return Response({'error': 'Invalid credentials'}, status=400)
        return Response(serializer.errors, status=400)

# Эндпоинты для профиля пользователя (чтобы обновлять данные: фамилия, имя, город, телефон, почта)
class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        data = request.data
        # Обновляем стандартные поля пользователя
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.save()
        # Обновляем данные профиля
        profile = user.profile
        profile.city = data.get('city', profile.city)
        profile.phone = data.get('phone', profile.phone)
        profile.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)

# Корзина
class CartView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            try:
                cart = Cart.objects.prefetch_related('items__product__category', 'items__product__sizes', 'items__product__colors').get(user=request.user)
            except Cart.DoesNotExist:
                cart = Cart.objects.create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            try:
                cart = Cart.objects.prefetch_related('items__product__category', 'items__product__sizes', 'items__product__colors').get(session_key=session_key)
            except Cart.DoesNotExist:
                cart = Cart.objects.create(session_key=session_key)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddToCartView(APIView):
    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product does not exist'}, status=status.HTTP_404_NOT_FOUND)
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity
        if cart_item.quantity > product.stock:
            return Response(
                {'error': f'Not enough stock for {product.name}. Available: {product.stock}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        cart_item.save()
        return Response({'message': 'Item added to cart', 'quantity': cart_item.quantity})

class RemoveFromCartView(APIView):
    def delete(self, request, cart_item_id):
        try:
            cart_item = CartItem.objects.get(id=cart_item_id)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item does not exist'}, status=status.HTTP_404_NOT_FOUND)

# Создание заказа с поддержкой промокода
class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.create(customer=request.user)
        total_price = 0
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity
            )
            total_price += cart_item.product.price * cart_item.quantity
        promo_code_str = request.data.get('promo_code')
        if promo_code_str:
            try:
                promo = PromoCode.objects.get(code=promo_code_str)
                if not promo.is_valid():
                    return Response({'error': 'Invalid or expired promo code'}, status=status.HTTP_400_BAD_REQUEST)
                discount = promo.discount_percentage
                total_price = total_price * (100 - discount) / 100
                promo.apply_usage()
            except PromoCode.DoesNotExist:
                return Response({'error': 'Promo code does not exist'}, status=status.HTTP_404_NOT_FOUND)
        order.total_price = total_price
        order.save()
        cart.items.all().delete()
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Обновление статуса заказа (только для администраторов)
class UpdateOrderStatusView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        new_status = self.request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            serializer.save(status=new_status)
        else:
            raise ValidationError({'status': 'Invalid status'})

# Эндпоинты для избранного
class AddFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        fav, created = Favorite.objects.get_or_create(user=request.user, product=product)
        if created:
            return Response({'message': 'Product added to favorites'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Product already in favorites'}, status=status.HTTP_200_OK)

class RemoveFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, product_id):
        try:
            fav = Favorite.objects.get(user=request.user, product__id=product_id)
            fav.delete()
            return Response({'message': 'Product removed from favorites'}, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found'}, status=status.HTTP_404_NOT_FOUND)

class FavoriteListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        favorites = Favorite.objects.filter(user=self.request.user)
        product_ids = favorites.values_list('product__id', flat=True)
        return Product.objects.filter(id__in=product_ids).select_related('category').prefetch_related('sizes', 'colors')

# Эндпоинт для SEO информации и Яндекс Метрики
class SEOInfoView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        seo_info = {
            "yandex_metrica_counter_id": "YOUR_YANDEX_METRICA_COUNTER_ID",  # Замените на реальный ID
            "metatags": {
                "default_title": "Интернет-магазин My Coats Store",
                "default_description": "Лучшие товары по отличным ценам. Покупайте онлайн в My Coats Store.",
            }
        }
        return Response(seo_info)

# Эндпоинт для получения хлебных крошек для товара
class ProductBreadcrumbsView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Создаем хлебные крошки
        breadcrumbs = [{'label': 'Главная', 'href': '/'}]
        
        # Добавляем категории
        category = product.category
        category_chain = []
        while category:
            category_chain.append({'label': category.name, 'href': f'/category/{category.id}'})
            category = category.parent
        
        # Добавляем категории в хлебные крошки в обратном порядке
        breadcrumbs.extend(reversed(category_chain))
        
        # Добавляем сам товар
        breadcrumbs.append({'label': product.name, 'href': f'/product/{product.id}'})
        
        return Response(breadcrumbs)