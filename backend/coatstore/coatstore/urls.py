from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from products.views import ProductBreadcrumbsView


# Простая функция-представление для корневого URL
def home_view(request):
    return HttpResponse("Welcome to My Coats Store!")

# Настройка Swagger/OpenAPI документации
schema_view = get_schema_view(
    openapi.Info(
        title="My Coats Store API",
        default_version='v1',
        description="API for My Coats Store",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@mycoatsstore.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)

urlpatterns = [
    # Админка Django
    path('admin/', admin.site.urls),
    
    # Маршруты API для товаров
    path('api/', include('products.urls')),
    
    # Корневой URL
    path('', home_view, name='home'),
    
    # Документация API (Swagger)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    
    # Документация API (ReDoc)
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # Эндпоинт для хлебных крошек
    path('api/product/<int:pk>/breadcrumbs/', ProductBreadcrumbsView.as_view(), name='product-breadcrumbs'),

]


