from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, Size, Order, OrderItem, Cart, CartItem

# Сериализатор для регистрации пользователя
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

# Сериализатор для авторизации пользователя
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True, style={'input_type': 'password'}
    )

# Сериализатор для отображения данных пользователя
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size_value', 'description']

class ProductSerializer(serializers.ModelSerializer):
    # Для создания ожидаем список идентификаторов размеров
    sizes = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(),
        many=True,
        write_only=True
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'sizes']

    def create(self, validated_data):
        sizes = validated_data.pop('sizes', [])
        product = Product.objects.create(**validated_data)
        for size in sizes:
            product.sizes.add(size)
        return product

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Для отображения используем полный сериализатор размеров
        rep['sizes'] = SizeSerializer(instance.sizes.all(), many=True).data
        return rep

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = ['id', 'customer', 'created_at', 'total_price', 'status', 'items']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']
