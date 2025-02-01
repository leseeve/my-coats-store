from django.contrib import admin
from django import forms
from .models import Product, Size, Order, OrderItem

# Кастомная форма для модели Product с изменённым виджетом для поля sizes
class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'

    sizes = forms.ModelMultipleChoiceField(
        queryset=Size.objects.all(),
        widget=forms.CheckboxSelectMultiple
    )

# Админка для Product с дополнительными настройками
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ('id', 'name', 'price', 'stock')  # отображаем id и основные поля
    search_fields = ('name',)
    list_filter = ('sizes',)

# Админка для Size, чтобы отображался id вместе с размером и описанием
class SizeAdmin(admin.ModelAdmin):
    list_display = ('id', 'size_value', 'description')
    search_fields = ('size_value',)

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

# Регистрация моделей с кастомными админ-классами
admin.site.register(Product, ProductAdmin)
admin.site.register(Size, SizeAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
