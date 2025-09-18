from django.db import models
from django.utils.text import slugify

class BookCard(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    # Use URLField for simplicity; if you want to upload images later you can switch to ImageField.
    image = models.URLField(blank=True)  
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            i = 1
            while BookCard.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
