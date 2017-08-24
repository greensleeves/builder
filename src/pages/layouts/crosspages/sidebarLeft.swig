{# 
    sidebarLeft
#}

{# выводим основные блоки #}
{% for block in sidebarLeft.blocks %}

    {# если используем генератор тега #}
    {% if block.opt %}
        {[ macro.tag(block) ]}
    {% endif %}

{% endfor %}