{# 
    MainContent
#}

{# выводим основные блоки #}
{% for block in main.blocks %}

    {# если используем генератор тега #}
    {% if block.opt %}
        {[ macro.tag(block) ]}
    {% endif %}

{% endfor %}