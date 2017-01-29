from django.views.generic import FormView, TemplateView
from django.urls import reverse_lazy

from . import forms


# Create your views here.
class JoinView(FormView):
    template_name = "join.html"
    form_class = forms.JoinForm
    success_url = reverse_lazy('games')

    def form_valid(self, form):
        self.request.session['name'] = form.cleaned_data['name']
        return super(JoinView, self).form_valid(form)


class GamesView(TemplateView):
    template_name = "games.html"

    def get_context_data(self, **kwargs):
        context = super(GamesView, self).get_context_data(**kwargs)
        context['name'] = self.request.session['name']
        return context
