from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Book, CartItem
from django.contrib.auth.models import User
from .serializers import BookSerializer, AddToCartSerializer, CartItemSerializer

class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = []

class AddToCartView(generics.CreateAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book_id = serializer.validated_data['book_id']
        quantity = serializer.validated_data['quantity']
        user = request.user

        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the book is already in the user's cart
        cart_item, created = CartItem.objects.get_or_create(user=user, book=book)

        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        cart_item_serializer = CartItemSerializer(cart_item)
        return Response(cart_item_serializer.data, status=status.HTTP_201_CREATED)
    
class UserCartItemsView(generics.ListAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CartItem.objects.filter(user=user)