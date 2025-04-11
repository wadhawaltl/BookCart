from rest_framework import serializers
from .models import Book, CartItem

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class AddToCartSerializer(serializers.Serializer):
    book_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(min_value=1, default=1)

class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)  # To show book details in the cart
    class Meta:
        model = CartItem
        fields = ['id', 'book', 'quantity']
        read_only_fields = ['user'] # User should be set on the server side