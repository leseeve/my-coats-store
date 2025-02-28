from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Модель категории с возможностью создания подкатегорий
class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subcategories')

    def __str__(self):
        return self.name

# Модель цвета
class Color(models.Model):
    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, blank=True, null=True)  # Например, "#FFFFFF"
    
    def __str__(self):
        return self.name

# Модель размера
class Size(models.Model):
    size_value = models.PositiveIntegerField()
    description = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return str(self.size_value)

# Модель продукта с добавлением sku, категории и цветов
class Product(models.Model):
    name = models.CharField(max_length=255)  # Название товара
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)  # Артикул товара
    description = models.TextField()         # Описание товара
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Цена товара
    stock = models.IntegerField()            # Количество товара на складе
    sizes = models.ManyToManyField(Size)     # Доступные размеры
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )  # Категория товара
    colors = models.ManyToManyField(
        Color,
        blank=True,
        related_name='products'
    )  # Доступные цвета товара
    
    def __str__(self):
        return self.name

# Промежуточная модель для связи заказа и товаров
class OrderItem(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

# Модель заказа
class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(default=timezone.now)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    
    def __str__(self):
        return f"Order #{self.id} by {self.customer.username}"
    
    def calculate_total_price(self):
        self.total_price = sum(item.product.price * item.quantity for item in self.items.all())
        self.save()

# Модель корзины
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"Cart {self.id} for User {self.user.username if self.user else 'Anonymous'}"

# Промежуточная модель для связи корзины и товаров
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"

# Модель избранного
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('user', 'product')

# Модель для промокодов
class PromoCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)  # Например, 10.00 для 10%
    active = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(blank=True, null=True)
    usage_limit = models.PositiveIntegerField(blank=True, null=True)  # Максимальное количество использований
    used_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.code

    def is_valid(self):
        if not self.active:
            return False
        if self.expiration_date and self.expiration_date < timezone.now():
            return False
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False
        return True

    def apply_usage(self):
        self.used_count += 1
        self.save()

# Модель для записи просмотренных товаров (для аутентифицированных пользователей)
class RecentlyViewed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recently_viewed')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-viewed_at']
    
    def __str__(self):
        return f"{self.user.username} viewed {self.product.name} at {self.viewed_at}"

# Новая модель для расширения данных пользователя (профиль)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    city = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"

# Сигнал для автоматического создания/обновления профиля при сохранении пользователя
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
         Profile.objects.create(user=instance)
    else:
         instance.profile.save()

