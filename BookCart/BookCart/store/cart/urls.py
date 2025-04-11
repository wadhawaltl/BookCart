from django.urls import path
from .views import BookListView, AddToCartView, UserCartItemsView

urlpatterns = [
    path('books/', BookListView.as_view(), name='book-list'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/user/<int:user_id>/items/', UserCartItemsView.as_view(), name='user-cart-items'),
]