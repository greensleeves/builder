{# 
    sidebarRight
#}

{# выводим основные блоки #}
{% for block in sidebarRight.blocks %}

    {# если используем генератор тега #}
    {% if block.opt %}
        {[ macro.tag(block) ]}
    {% endif %}

{% endfor %}