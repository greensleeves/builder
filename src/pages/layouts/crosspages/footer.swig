{# 
    Footer
#}

{# выводим основные блоки #}
{% for block in footer.blocks %}

    {# если используем генератор тега #}
    {% if block.opt %}
        {[ macro.tag(block) ]}
    {% endif %}

{% endfor %}