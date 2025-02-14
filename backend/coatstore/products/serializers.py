from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Product, Size, Order, OrderItem, Cart, CartItem, Category,
    Color, PromoCode, Profile
)

# Сериализатор для модели Category с SEO полями
class CategorySerializer(serializers.ModelSerializer):
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'meta_title', 'meta_description']
    
    def get_meta_title(self, obj):
        return f"Купить {obj.name} в интернет-магазине My Coats Store"
    
    def get_meta_description(self, obj):
        return f"Лучшие предложения по категории {obj.name}. Оригинальные товары по привлекательным ценам."

# Сериализатор для модели Color
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

# Сериализатор для профиля пользователя
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['city', 'phone']

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

# Обновлённый сериализатор для пользователя, включающий профиль
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

# Сериализатор для продукта с SEO полями
class ProductSerializer(serializers.ModelSerializer):
    sizes = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(), many=True, write_only=True
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, allow_null=True, required=False
    )
    colors = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), many=True, write_only=True, required=False
    )
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'description', 'price', 'stock',
                  'sizes', 'category', 'colors', 'meta_title', 'meta_description']
    
    def create(self, validated_data):
        sizes = validated_data.pop('sizes', [])
        category = validated_data.pop('category', None)
        colors = validated_data.pop('colors', [])
        product = Product.objects.create(**validated_data, category=category)
        for size in sizes:
            product.sizes.add(size)
        for color in colors:
            product.colors.add(color)
        return product
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['sizes'] = SizeSerializer(instance.sizes.all(), many=True).data
        rep['category'] = CategorySerializer(instance.category).data if instance.category else None
        rep['colors'] = ColorSerializer(instance.colors.all(), many=True).data
        return rep

    def get_meta_title(self, obj):
        return f"Купить {obj.name} по цене {obj.price} ₽ | My Coats Store"
    
    def get_meta_description(self, obj):
        desc = obj.description if obj.description else ""
        return f"{desc[:150]}..." if len(desc) > 150 else desc

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size_value', 'description']

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

# Сериализатор для промокодов
class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ['id', 'code', 'discount_percentage', 'active', 'expiration_date', 'usage_limit', 'used_count']
