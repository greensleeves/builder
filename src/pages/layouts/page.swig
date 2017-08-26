<!DOCTYPE html>
<html lang="ru">
<!-- tmpl {[ _meta.uri ]} -->
<head>

	{% block meta %}{% endblock %}

    {% block head %}{% endblock %}

</head>
<body>

	<div class="
		page
		page_{[ _meta.uri ]}
		{% if sidebarLeft %} has-sidebar-left{% endif %}
		{% if sidebarRight %} has-sidebar-right{% endif %}"
		{% if main.itemtype %}itemscope="" itemtype="{[ main.itemtype ]}"{% endif %}
		>

		{% block upper %}{% endblock %}
		{% block sidebarLeft %}{% endblock %}
		{% block main %}{% endblock %}
		{% block sidebarRight %}{% endblock %}
		{% block footer %}{% endblock %}

	</div>

</body>
<!-- /tmpl {[ _meta.uri ]} -->
</html>