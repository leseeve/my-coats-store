from django.contrib import admin
from django import forms
from .models import Product, Size, Order, OrderItem, Category, Color, PromoCode

# Кастомная форма для модели Product с изменёнными виджетами для полей sizes, category и colors
class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
    
    sizes = forms.ModelMultipleChoiceField(
        queryset=Size.objects.all(),
        widget=forms.CheckboxSelectMultiple
    )
    colors = forms.ModelMultipleChoiceField(
        queryset=Color.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

# Админка для Product с дополнительными настройками
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('id', 'name', 'sku', 'price', 'stock', 'category')
    search_fields = ('name', 'sku',)
    list_filter = ('sizes', 'category', 'colors')

class SizeAdmin(admin.ModelAdmin):
    list_display = ('id', 'size_value', 'description')
    search_fields = ('size_value',)

# Админка для Category
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)

# Админка для Color
class ColorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'hex_code')
    search_fields = ('name',)

# Админка для PromoCode
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'discount_percentage', 'active', 'expiration_date', 'usage_limit', 'used_count')
    search_fields = ('code',)

# Инлайн для OrderItem, используемый в OrderAdmin
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

# Админка для Order с настройками отображения и фильтрами
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'created_at', 'total_price', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('customer__username', 'id')
    inlines = [OrderItemInline]

# Админка для OrderItem для удобного просмотра отдельных позиций заказа
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity')
    search_fields = ('order__id', 'product__name')

admin.site.register(Product, ProductAdmin)
admin.site.register(Size, SizeAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Color, ColorAdmin)
admin.site.register(PromoCode, PromoCodeAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
