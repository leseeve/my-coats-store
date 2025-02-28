from django.urls import path
from django.views.decorators.cache import cache_page
from .views import (
    ProductListView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
    SimilarProductsView,
    RecordProductView,
    RecentlyViewedListView,
    OrderListView,
    OrderDetailView,
    UserRegistrationView,
    UserLoginView,
    ProfileUpdateView,
    CartView,
    AddToCartView,
    RemoveFromCartView,
    CreateOrderView,
    UpdateOrderStatusView,
    AddFavoriteView,
    RemoveFavoriteView,
    FavoriteListView,
    SEOInfoView
)

urlpatterns = [
    # Продукты
    path('products/', cache_page(60 * 15)(ProductListView.as_view()), name='product-list'),
    path('products/create/', ProductCreateView.as_view(), name='product-create'),
    path('products/update/<int:pk>/', ProductUpdateView.as_view(), name='product-update'),
    path('products/<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    # Похожие товары
    path('products/<int:pk>/similar/', cache_page(60 * 15)(SimilarProductsView.as_view()), name='similar-products'),
    # Запись просмотра товара
    path('products/record-view/', RecordProductView.as_view(), name='record-product-view'),
    # Недавно просмотренные товары
    path('products/recently-viewed/', RecentlyViewedListView.as_view(), name='recently-viewed'),
    
    # Заказы
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('orders/<int:pk>/update-status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
    
    # Пользователи
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    # Профиль: получение и обновление данных (фамилия, имя, город, телефон, почта)
    path('profile/', ProfileUpdateView.as_view(), name='profile'),
    
    # Корзина
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove/<int:cart_item_id>/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    
    # Избранное
    path('favorites/add/', AddFavoriteView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:product_id>/', RemoveFavoriteView.as_view(), name='remove-favorite'),
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    
    # SEO & Yandex Metrica
    path('seo/', SEOInfoView.as_view(), name='seo-info'),
]