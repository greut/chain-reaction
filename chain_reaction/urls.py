from django.conf import settings
from django.conf.urls import url, include, static
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('authtools.urls')),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'', include(
        'social_django.urls', namespace='social')),
    url(r'', include('games.urls')),
]

if settings.DEBUG:
    try:
        import debug_toolbar
        urlpatterns += [url(r'^__debug__/', include(debug_toolbar.urls)), ]
    except ImportError:
        pass

    urlpatterns += static.static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT)
