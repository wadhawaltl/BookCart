from django.contrib import admin
from .models import Book, CartItem

# Register the Book model
admin.site.register(Book)

# Register the CartItem model
admin.site.register(CartItem)