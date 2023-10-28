from django import template
from os.path import basename

register = template.Library()

@register.filter(name='basename')
def get_basename(value):
    return basename(value)