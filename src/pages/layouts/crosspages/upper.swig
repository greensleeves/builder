{# 
    Верхний блок
#}

{# выводим основные блоки #}
{% for block in upper.blocks %}

    {# если используем генератор тега #}
    {% if block.opt %}
        {[ macro.tag(block) ]}
    {% endif %}

{% endfor %}