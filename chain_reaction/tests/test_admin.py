"""Admin related URLs (smoke tests)."""


def test_admin(admin_client):
    response = admin_client.get('/admin/')
    assert response.status_code == 200
