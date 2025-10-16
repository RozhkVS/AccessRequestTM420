//******************************************************************
// Класс statusmessage осуществляет отображение строки
// message в строке сотояния браузера.
// Конструктор:
// st = new statusmessage(mes, mode, maxlen, dt)
// Конструктору передаются следующие параметры:
// mes - отображаемая строка,
// mode - способ отображение.
// Возможные значение mode:
//		'leftToRight' - отображение осуществляется слева направо,
//		'rightToLeft' - строка отображается справа налево
//		'marque' - строка попеременно перемещается вправо и влево,
//		'ticker' -бегущая строка,
//		'random' - строка "проявляется" случайным образом.
// maxlen - максимальное число символов, отображаемых в строке состояния
// dt - временной интервал в миллисекундах, через который осуществляется
//		обновление надписи в строке состояния.
// Обязательным является только первый параметр, для остальных имеются
// умалчиваемые значения.
//
// Методы:
// start(mode) - запуск отображения, при запуске можно измененить
// режим, заданный в конструкторе
// stop() - завершение работы
//
// Использование:
// var  st = new statusmessage(mes, mode)	// конструктор
// st.start(mode)							// запуск отображения
// st.stop()								// завершение отображения
//
// Внимание! В документе может быть только один экземпляр
// объекта statusmessage, так как  из-за вызова setTimeout
// отображение текста в статусной строке производится в отдельном
// программном потоке и экземляры объекта  будут осуществлять вывод
// одновременно.
//******************************************************************
function statusmessage(mes, mode, maxlen, dt){
	this.dt =						// Интервал времени в миллисекундах между появлениями отдельных символов
		!dt ? 100: dt
	this.message = mes				// Отображаемое сообщение
	this.mode =						// Способ отображения сообщения
		 (mode==null) ? "TICKER":
					mode.toUpperCase()
	this.len = mes.length			// Длина сообщения
	this.counter = 0				// Счетчик
	this.pstring =""				// Отображаемый в строке состояния текст
	this.blankstring =""			// Cтрока пробелов
	this.maxlen = 					// Максимальная длина отображаемой строки
		! maxlen ? 120 : maxlen
	this.enabled = true				// Эффект задействован
	this.pos = new Array()			// Массив для случайного отображаения символов в строке
	this.obj = "auxObj"
	eval(this.obj + "=this")
}

function start(mode){				// Отображение сообщения
	var i
	if (mode)						// Могу изменить эффект при запуске
		this.mode = mode.toUpperCase()
	this.enabled = true
	this.counter = 0
	this.pstring = ''
	this.blankstring=''
	this.pstring =""
	if (this.mode=="LEFTTORIGHT"){	// Слева направо
		this.leftToRight()
		return
	}
	if (this.mode=="RIGHTTOLEFT"){	// Справа налево
		for(i=0;i<this.len;i++) this.pstring+=" "
		this.rightToLeft()
		return
	}
	if (this.mode=="MARQUEE"){	// Перемещение строки
		this.counter = 0
		for(i=0;i<this.maxlen;i++) this.blankstring+=" "
		this.marquee()
		return
	}
	if (this.mode=="RANDOM"){	// Случайное отображение символов строки
		this.freeze = Math.max(10,Math.floor(this.len/3))
		for(i=0;i<this.len;i++) this.pstring+=" "
		this.random()
		return
	}
	if (this.mode=="TICKER"){	// Бегущая строка
		this.pstring=this.message + "       "
		this.ticker()
		return
	}

	status = this.message			// Отображение самым простым способом
}
statusmessage.prototype.start = start

function stop(){
	this.enabled = false
	status=this.message
}
statusmessage.prototype.stop = stop

function leftToRight(){
	if (this.enabled && this.mode=="LEFTTORIGHT" ){
		if (this.counter == 0) {
			this.incr = 1
			this.pstring =""
		}
		if (this.counter == this.len) this.incr = -1
		if (this.incr>0)
			this.pstring +=						// Добавляю символ к отображаемой строке
				this.message.charAt(this.counter)
		if (this.incr<0)
			this.pstring = this.pstring.substring(0,this.counter)
		this.counter += this.incr				// Увеличиваю или уменьшаю счетчик
		status = this.pstring
		setTimeout(this.obj+					// Рекурсивный вызов функции
					'.leftToRight()', this.dt)
	}
}
statusmessage.prototype.leftToRight = leftToRight

function rightToLeft(){
	if (this.enabled && this.mode=="RIGHTTOLEFT"){
		if (this.counter == 0) 	this.incr = 1
		if (this.counter == this.len) this.incr = -1
		if (this.incr>0) this.pstring =			// Добавляю символ к отображаемой строке справа
			this.pstring.substr(1,this.len-1)+this.message.charAt(this.counter)
		if (this.incr<0) this.pstring =
			" "+this.pstring.substring(0,this.len-1)
		this.counter += this.incr				// Увеличиваю или уменьшаю счетчик
		status = this.pstring 
		setTimeout(this.obj+					// Рекурсивный вызов функции
					'.rightToLeft()', this.dt)
	}
}
statusmessage.prototype.rightToLeft = rightToLeft

function marquee(){
	if (this.enabled && this.mode=="MARQUEE"){
		if (this.counter == 0) this.incr = 1
		if (this.counter == this.maxlen-this.len) this.incr = -1
		this.pstring = this.blankstring.substr(0,this.counter)+this.message
		if (this.incr>0) this.counter++
		if (this.incr<0) this.counter--
		status = this.pstring
		setTimeout(this.obj+					// Рекурсивный вызов функции
					'.marquee()', this.dt)
	}
}
statusmessage.prototype.marquee = marquee

function random(){
	var i;
	if (this.enabled && this.mode=="RANDOM"){
		if (this.counter==0 || this.counter==(this.len+this.freeze)){
			for (i=0; i < this.len; i++)
				this.pos[i] = i
			this.plen = this.len
			if (this.counter==0) {
				this.incr = 1
				this.s1 = mes
				this.s2=""
				for(i=0;i<this.len; i++) this.s2 +=' '
			}
			else {
				this.incr = -1
				this.counter = this.len - 1
				this.s1 = ''
				this.s2 = mes
				for(i=0;i<this.len; i++) this.s1 +=' '
			}
		}
		if (this.plen>0){					// Имеются заменяемые символы
			var k =							// Положение заменяемого символа в массиве
				Math.floor(Math.random()*this.plen)
			var m = this.pos[k]				// Положение занимаемого символа в строке
			var ch = this.s1.charAt(m)		// Заменяемый символ
			if (m==0) this.s2 = ch + this.s2.substr(1)
			else if (m==(this.len-1))		// Преобразование выводимой строки
				this.s2 = this.s2.substr(0,this.len-1)+ch
			else
				this.s2 = this.s2.substr(0, m) + ch + this.s2.substr(m+1)
			// Изымаю элемент из массива
			this.plen--
			if (this.plen)
				for (var i=k; i<=this.plen-1; i++)
					this.pos[i] = this.pos[i+1]
			this.pos[this.plen] = null
		}
	//alert('counter='+this.counter+' k='+k+' m='+m+' ch='+ch+' plen='+this.plen+
	//'\ns1='+this.s1+'\ns2='+this.s2+'\npos='+this.pos)
		this.counter += this.incr
		status = this.s2 
			setTimeout(this.obj+				// Рекурсивный вызов функции
						'.random()', this.dt)
	}
}
statusmessage.prototype.random = random

function ticker(){	// Бегущая строка
	if (this.enabled && this.mode=="TICKER"){
		this.pstring = this.pstring.substr(1,this.pstring.length)+this.pstring.charAt(0)
		status = this.pstring
		setTimeout(this.obj+						// Рекурсивный вызов функции
				'.ticker()', this.dt)
	}
}
statusmessage.prototype.ticker = ticker