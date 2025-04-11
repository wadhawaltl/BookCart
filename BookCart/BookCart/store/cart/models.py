from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    bookname = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    isbn = models.CharField(max_length=20, unique=True)  # Optional, but good for unique identification
    quantity = models.IntegerField(default=0)  # To track the stock of the book

    def __str__(self):
        return self.bookname

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'book')  # Ensure a user can't add the same book to the cart multiple times

    def __str__(self):
        return f"{self.quantity} x {self.book.bookname} in {self.user.username}'s cart"