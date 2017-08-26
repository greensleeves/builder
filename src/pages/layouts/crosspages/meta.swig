{# 
    meta
#}

{# выводим основные блоки #}
{% for block in meta.blocks %}

    {# если используем генератор тега #}
    {% if block.opt %}
        {[ macro.tag(block) ]}
    {% endif %}

{% endfor %}