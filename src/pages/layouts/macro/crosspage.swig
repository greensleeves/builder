{#

	Макрос тега

#}

{% macro tag(block, parent) %}

	{# Более краткая запись опций тега #}
	{% set opt = block.opt %}

	{% set tagKeys = ['meta', 'link', 'img'] %}

	{#

		Получаем объект с настройками

		opt = {
			tag: тег,
			layouts: массив, - служит для автоматической простановки классов у RGB блоков: block_layout
			conditions: строка, - передается conditions-обьект в swig шаблон для обертки тега (обычно это __length)
			tagClose: true/false - закрывать ли тег,
			attrs: {
				id: ID - id тега,
				classList: ['className'] - массив классов,
				attrsList: ['attrName="attrValue"'] - массив аттрибутов
			},
			contents: [
				{
					path: 'ПУТЬ' - путь до файла если это инклюд
					param: { - объект с параметрами для включаемого шаблона swig
						title - заголовок
						link - ссылка
						include - массив инклюдов
					}
				},
				{
					data: - данные
				}
			]
		}

	#}

	{#
		Если нужна обертка в тег
		иначе просто выводим контент
	#}

	{% if opt.format == 'json' %}

		{[ opt.contents[0].param.data | json | safe ]}

	{% elseif opt.rgb && opt.render == false %}

		{# не выводим шаблон #}

	{% else %}
		
		{% if opt.rgb && env != 'prod' %}
			<!-- rgb {[ opt.block ]}{% if opt.elem %}&{[ opt.elem ]}{% endif %}{% if opt.mod %}:{[ opt.mod ]}{% endif %} -->
		{% endif %}
		
		{% if opt.conditions %}
			{% for conditions in opt.conditions  %}
				{{{[ conditions]}}}
			{% endfor %}
		{% endif %}

		{# Выводим аттрибуты блока #}
		{% if opt.tag %}

			<{[ opt.tag ]}
				{% for attrName, attrValue in opt.attrs  %}
					{[ attrName ]}

					{% if attrValue %}
						="

							{[ attrValue ]}

							{# Автоматическая простановка классов у блоков #}
							{% if (opt.block or opt.shift) and attrName == 'class' %}

								{[ macro.tag_class(opt, parent) ]}

							{% endif %}

						"
					{% endif %}

				{% endfor %}

				{# Автоматическая простановка классов у блоков, если класса нет в атрибутах #}
				{% if !opt.attrs['class'] %}

					{% if opt.rgb or opt.layouts %}
						class="
							{[ macro.tag_class(opt, parent) ]}
						"
					{% endif %}

				{% endif %}

				{# Автоматическая простановка id у блоков #}
				{% if !opt.attrs['id'] %}

					{% if opt.rgb %}
						id="
							{[ macro.tag_id(opt) ]}
						"
					{% endif %}

				{% endif %}

				{% if opt.shift %}

					{# Если RGB - адаптивный блок (shift) добавляем аттрибут data-blocksShifterWidthHash #}
					{% if !opt.attrs['data-blocksShifterWidthHash'] %}
						data-blocksShifterWidthHash="{[ opt.shift.resolution ]}"
					{% endif %}

					{# Если RGB - адаптивный блок (shift) добавляем аттрибут data-blocksShifterId #}
					{% if !opt.attrs['data-blocksShifterId'] %}
						
						{# !!! shift.id используется в старой версии RGB, после перехода на RG.B проверку ниже надо удалить #}
						{% if opt.shift.id %}
							data-blocksShifterId="{[ opt.shift.id ]}"
						{% endif %}
						
						{% if opt.shift.block %}
							data-blocksShifterId="{[ opt.shift.block ]}"
						{% endif %}
						
					{% endif %}

				{% endif %}

				{[ macro.tag_gtm_label(opt) ]}

				{[ macro.tag_tools(opt) ]}

			{% if !opt.tag | rgInArray(tagKeys) %}
				>
			{% endif %}

		{% endif %}

			{# Выводим контент блока #}

			{% if !opt.shift or opt.shift.active %}

				{% if opt.contents %}

					{# Проходим по всем элементам контента #}
					{% for content in opt.contents %}

						{# Если это инклюд #}
						{% if content.path %}

							{# Подключаем инклюд #}
								{% include content.path with content.param %}

						{# Если это данные #}
						{% elseif content.data %}

							{# Выводим данные #}
							{[ content.data | safe ]}

						{% elseif content.styleInline %}

							<style {% for attrName, attrValue in content.styleInline.attrs  %}
								{[ attrName ]}

								{% if attrValue %}
									="{[ attrValue ]}"
								{% endif %}

							{% endfor %}>{[ styleData | safe ]}</style>

						{% endif %}

					{% endfor %}

				{% endif %}

			 {% endif %}

			{# Если есть вложенная итерация #}

			{% if opt.blocks %}

				{% for block in opt.blocks %}

					{[ tag(block) ]}

				{% endfor %}

			{% endif %}

		{% if opt.tag %}

			{# Закрываем тег #}
			{% if !opt.tag | rgInArray(tagKeys) %}
				</{[ opt.tag ]}>
			{% else %}
				>
			{% endif %}

		{% endif %}

		{% if opt.conditions %}
			{% for conditions in opt.conditions|reverse  %}
				{{{[ conditions|replace('^#|\^', '/', 'g') ]}}}
			{% endfor %}
		{% endif %}
		
		{% if opt.rgb  && env != 'prod' %}
			<!-- /rgb {[ opt.block ]}{% if opt.elem %}&{[ opt.elem ]}{% endif %}{% if opt.mod %}:{[ opt.mod ]}{% endif %} -->
		{% endif %}
		
	{% endif %}

{% endmacro %}



{#

	Макрос tag_class

#}

{% macro tag_class(opt, parent) %}

	{% if opt.layouts %}

		{% for layout in opt.layouts %}
			l-{[ layout ]}
		{% endfor %}

	{% endif %}


	{% if opt.rgb %}

		b-{[ opt.block ]}{% if opt.elem %}__{[ opt.elem ]}{% endif %}

		{% if opt.mod %}
			b-{[ opt.block ]}{% if opt.elem %}__{[ opt.elem ]}{% endif %}_{[ opt.mod ]}
		{% endif %}

		{% if parent %}
			{% if parent.type == 'elem' %}
				b-{[ parent.name ]}-item
			{% else %}
				b-{[ parent.name ]}__item
			{% endif %}
		{% endif %}

	{% endif %}


	{% if opt.shift %}

		shiftContainer
		{% if opt.shift.active %}
			shiftContainer_active
		{% endif %}

	{% endif %}

{% endmacro %}


{#

	Макрос tag_gtm_label

#}

{% macro tag_gtm_label(opt) %}

	{% if opt.rgb %}

		data-label="
			{[ opt.block ]}{% if opt.elem %}&{[ opt.elem ]}{% endif %}{% if opt.mod %}:{[ opt.mod ]}{% endif %}
		"

	{% endif %}

{% endmacro %}


{#

	Макрос для вывода данных rg tools

#}

{% macro tag_tools(opt) %}

	{% if opt.rgb && env != 'prod' %}

		data-rgtools="
			{[ opt.tools | json ]}
		"

	{% endif %}

{% endmacro %}


{#

	Макрос tag_id

#}

{% macro tag_id(opt) %}

	{% if opt.rgb %}

		rgb_{[ opt.block ]}{% if opt.elem %}__{[ opt.elem ]}{% endif %}{% if opt.mod %}_{[ opt.mod ]}{% endif %}{% if opt.shift.active %}_shiftActive{% endif %}

	{% endif %}

{% endmacro %}



{#

	Макрос инклюда

#}

{% macro include(opt) %}

	{% set path = opt.path %}
	{% set param = opt.param %}

	{# {[ opt | json ]} #}

	{# Подключаем инклюд #}
	{% if env != 'prod' %}
		<!-- tmpl {[ path|rgPathComm ]} -->
	{% endif %}
		{% include path with param %}
	{% if env != 'prod' %}
		<!-- /tmpl {[ path|rgPathComm ]} -->
	{% endif %}

{% endmacro %}


{#

	Макрос подключения RBG

#}

{% macro RGBi(opt, parent) %}

	{[ tag(opt, parent) ]}

{% endmacro %}



{#

	Макрос form

#}

{% macro form(opt) %}

	{% for form in opt %}

		{% if form.show %}

		<rg-form action="'{[ form.action ]}'" name="'{[ form.name ]}'" method="'{[ form.method ]}'" id="'{[ form.id ]}'" class="b-form__body {% if form.class %}{[ form.class ]}{% endif %}">

		{% endif %}

			{% if form.title %}

				<div class="b-form__title">
					{[ form.title ]}
				</div>

			{% endif %}

			{% if form.headNotice %}

				<div class="b-form__head-notice">{[ form.headNotice|safe ]}</div>

			{% endif %}

			{% for fieldset in form.fieldset %}

			<fieldset class="b-form__fieldset">

				{% if fieldset.title %}

					<div class="b-form__fieldset__title">
						{[ fieldset.title ]}
					</div>

				{% endif %}


				{% if fieldset.field %}

					{[ macro.form_field(fieldset.field, form) ]}

				{% endif %}

			</fieldset>

			{% endfor %}

			{% if form.notice %}

				<div class="b-form__notice">{[ form.notice|safe ]}</div>

			{% endif %}

		{% if form.message %}

			<rg-form-message

				form="'{[ form.name ]}'"

				{% if form.message.attrs %}
					{% for attrs in form.message.attrs %}
						{[ loop.key ]}="{[ attrs ]}"
					{% endfor %}
				{% endif %}

			></rg-form-message>

		{% endif %}

		{% if form.show %}

		</rg-form>

		{% endif %}

	{% endfor %}

{% endmacro %}


{#

	Макрос form field

	update 21.06.2016
		- раньше только items выводился как json
		- сделали чтобы все так выводилось.
		Пока тестируем на появление проблем

	update 22.06.2016
		- если все в json выводить, то у обычной строки добавляются ковычки
		- дописали новый фильтр isObject, который определяет, сложное или простое свойство

#}

{% macro form_field(opt, form) %}

	{% for field in opt %}

		<div class="b-field__wrapper b-field__{[ field.tag ]} b-field__{[ field.tag ]}_{[ field.attrs.type ]}">

			<{[ field.tag ]}

				form="'{[ form.name | json ]}'"

				{% if field.attrs %}
					{% for attrs in field.attrs %}

						{% if attrs | isObject %}
							{[ loop.key ]}="{[attrs | json]}"
						{% else %}
							{[ loop.key ]}="{[ attrs ]}"
						{% endif %}

					{% endfor %}
				{% endif %}

			></{[ field.tag ]}>

		</div>

	{% endfor %}

{% endmacro %}