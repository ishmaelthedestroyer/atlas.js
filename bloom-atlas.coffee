((_BA) ->
  'use strict'

  # # # # # # # # # # # # # # # # # # # #
  # # # # # # # # # # # # # # # # # # # #

  # Basic Helper Functions

  loaded = false

  wrapOnload = (fn, context) ->
    return fn() if loaded

    if window.attachEvent
      window.attachEvent 'onload', () ->
        loaded = true
        return fn() if !context
        return fn.call context
    else
      if window.onload
        current = window.onload
        combined = () ->
          loaded = true
          current()
          return fn() if !context
          return fn.call context
        window.onload = combined
      else
        window.onload = () ->
          loaded = true
          return fn() if !context
          return fn.call context

  # # # # # # # # # #

  extend = (one, two) ->
    # make sure valid objects
    return {} if !one and !two
    return one if !two || typeof two isnt 'object'
    return two if !one || typeof one isnt 'object'

    # iterate over keys, add to target object
    one[k] = two[k] for k in Object.keys two

    # return object
    return one

  # # # # # # # # # #

  getAllElementsWithAttribute = (attr) ->
    matching = []
    all = document.getElementsByTagName '*'

    for el in all
      matching.push el if el.getAttribute attr

    return matching

  # # # # # # # # # #

  # https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  uuid = () ->
    d = Date.now()
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) ->
      r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      ((if c is "x" then r else (r & 0x7 | 0x8))).toString 16
    )

  # # # # # # # # # #

  # random string
  random = (l) ->
    l = l || 10
    token = ""
    list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    i = 0

    while i < l
      token += list.charAt(Math.floor(Math.random() * list.length))
      i++

    return token

  # # # # # # # # # #

  # check value of cookie
  checkCookie = (name) ->
    val = document.cookie
    start = val.indexOf(" " + name + "=")
    start = val.indexOf(name + "=")  if start is -1

    if start is -1
      val = null
    else
      start = val.indexOf("=", start) + 1
      end = val.indexOf(";", start)
      end = val.length  if end is -1
      val = unescape(val.substring(start, end))

    return (if val? and val isnt "null" and val isnt "" then val else null)

  # # # # # # # # # #

  setCookie = (name, val, minutes) ->
    expires = new Date()
    expires.setMinutes expires.getMinutes() + minutes
    document.cookie = name + '=' + val + '; expires=' + expires.toUTCString() +
    '; path=/;'

    return val

  # # # # # # # # # # # # # # # # # # # #
  # # # # # # # # # # # # # # # # # # # #

  # Utility / Private Functions

  # get browser info
  gbi = (data) ->
    data = data || {} # return object

    N = navigator.appName
    ua = navigator.userAgent
    tem = undefined

    r=/(crios|opera|chrome|safari|firefox|msie|android|iphone|ipad)\/?\s*(\.?\d+(\.\d+)*)/i

    M = ua.match r
    M[2] = tem[1]  if M and (tem = ua.match(/version\/([\.\d]+)/i))?

    data.b = M[1]
    data.bv = M[2]
    data.sw = screen.width
    data.sh = screen.height

    # get browser width and height
    data.bw = window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth || 0
    data.bh = window.innerHeight || document.documentElement.clientHeight ||
      document.body.clientHeight || 0

    r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

    # check if mobile browser
    if r.test navigator.userAgent
      data.bm = true
    else
      data.bm = false

    # get operating system
    if navigator.appVersion.indexOf("Win") isnt -1
      data.os = "Windows"
    else if navigator.appVersion.indexOf("iPad") isnt -1
      data.os = "iOS"
    else if navigator.appVersion.indexOf("iPhone") isnt -1
      data.os = "iOS"
    else if navigator.appVersion.indexOf("Android") isnt -1
      data.os = "Android"
    else if navigator.appVersion.indexOf("Mac") isnt -1
      data.os = "Mac"
    else if navigator.appVersion.indexOf("Linux") isnt -1
      data.os = "Linux"
    else if navigator.appVersion.indexOf("X11") isnt -1
      data.os = "Unix"
    else
      data.os = "Unknown"

    return data

  # # # # # # # # # #

  # get visitor info
  gvi = (data) ->
    data = data || {}

    # local time, time zone, host + referrer
    _t = new Date()
    data.tl = new Date()

    _t = _t.toString()

    data.tz =
      (if _t.indexOf("(") > -1
        _t.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join("")
      else
        _t.match(/[A-Z]{3,4}/)[0])

    data.tz = RegExp.$1  if _BA._tz is "GMT" and /(GMT\W*\d{4})/.test(_t)

    data.h = window.location.host
    data.hf = window.location.href

    rh = document.referrer.split("/")[2]
    data.rh = rh if rh

    rf = document.referrer
    data.rf = rf if rf

    return data

  # # # # # # # # # # # # # # # # # # # #
  # # # # # # # # # # # # # # # # # # # #

  # Bloom Atlas

  ###
  # translations
  data =
    c: (if typeof params.c isnt 'undefined' then params.c else null) # campaign
    s: (if typeof params.s isnt 'undefined' then params.s else null) # secret
    cs: [] # secondary campaigns
    bz: [] # bloom zones
    be: [] # bloom event listeners
    BIRD: null  # Bloom Internal Referral Data
    vt: null # visitor token (long term)
    st: null # session token (short term)
    it: null # impression token (unique)
    rv: false # returning visitor
    tz: null # time zone
    tl: null # time local
    sw: null # screen width
    sh: null # screen height
    bw: null # browser width
    bh: null # browser height
    b: null # browser
    bv: null # browser version
    bm: false # browser mobile
    os: null # operating system
    h: null # host
    hf: null # host full
    rh: null # referrer host
    rf: null # referrer full
  ###

  Atlas = (params) ->
    if !(@ instanceof Atlas)
      return new Atlas params

    # BIRD (Bloom Internal Referral Data)
    @useBIRD = (if typeof params.BIRD isnt 'undefined' then params.BIRD else false)

    # campaign token
    @c = (if typeof params.c isnt 'undefined' then params.c else null)

    # impression / instance token
    @it = null # impression token

    # # # # #

    if !@c
      e = 'Atlas could not instantiate - no campaign specified!'
      return throw new Error e

    # # # # #

    wrapOnload @initBells, @ # prepare event listeners
    # wrapOnload @initGazelle, @ # prepare ads
    @capture() # send to server

    return @

  # # # # # # # # # #
  # # # # # # # # # #

  Atlas::reload = (c) ->
    @c = c || @c || uuid()

    wrapOnload @initBells, @ # prepare event listeners
    wrapOnload @initGazelle, @ # prepare ads
    @capture() # send to server

  # # # # # # # # # #
  # # # # # # # # # #

  Atlas::initBells = () ->
    bells = getAllElementsWithAttribute 'data-BELL'
    console.log 'Got bells.', bells
    e = 'click'

    for bell in bells
      ((bell) => # anonymous / async wrap
        campaign = bell.getAttribute 'data-BELL'
        cb = () =>
          console.log 'Someone rang the bell.', campaign
          @save
            c: campaign
          , 'event'
          bell.removeEventListener e, cb

        bell.addEventListener e, cb # add event listener to element
        bell.removeAttribute 'data-BELL' # prevent future initBells on element
      ) bell

  # # # # # # # # # #
  # # # # # # # # # #

  Atlas::initGazelle = () ->
    placeholders = getAllElementsWithAttribute 'data-GAZELLE'
    requests = []

    for p in placeholders
      ((p) -> # wrap async function
        data = p.getAttribute 'data-GAZELLE'
        try
          r = JSON.parse data
          requests.push r
        catch e
          return throw new Error 'Error! Badly formatted Gazelle parameters.'
      ) p

    console.log 'Initialized requests.', requests

  # # # # # # # # # #
  # # # # # # # # # #

  # get BIRD data
  Atlas::BIRD = () ->
    data = data || {}
    data.BIRD = null
    useBIRD = @useBIRD || false

    hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&")
    i = 0

    while i < hashes.length
      hash = hashes[i].split("=")
      if hash[0] is "BIRD"
        if useBIRD is false
          data.BIRD = hash[1]
          return data
        else
          data.BIRD = hash[1]
          break
      i++

    # TODO: remove BIRD from url

    anchors = document.getElementsByTagName 'a'
    href = ''
    i = 0

    # TODO: make sure BIRD not in url
    while i < anchors.length
      href = anchors[i].getAttribute("href")
      unless href is "#"
        href += (if href.indexOf("?") isnt 0 then "&" else "?")
        href += "BIRD=" + _BA._c
        anchors[i].setAttribute "href", href
      i++

    console.log 'got BIRD.', data.BIRD
    return data

  # # # # # # # # # #
  # # # # # # # # # #

  Atlas::capture = (data) ->
    data = data || {}
    data = extend data, gbi() # get browser info
    data = extend data, gvi() # get visitor info
    data = extend data, @BIRD() # get / set BIRDs

    data.it = @it = uuid() # new impression / instance token
    data.c = data.c || @c # campaign token

    @save data, 'impression' # send data to server

    return @

  # # # # # # # # # #
  # # # # # # # # # #

  Atlas::save = (data, type) ->
    # TODO: return false or throw error if typeof data !== 'object'

    data.vt = do ( ->
      val = checkCookie '_BA_vt'
      data.rv = true if val and type is 'impression' # add returning visitor flag if impression log
      return val
     ) || do ( ->
      data.rv = false
      return setCookie '_BA_vt', uuid(), (60 * 24 * 365 * 2) # expires in 2 years
    )

    data.st = checkCookie('_BA_st') # check if session cookie set
    data.st = setCookie '_BA_st', data.st || uuid(), 30 # refresh or set new session cookie

    # get (or set) impression token
    data.it = @it || ( =>
      @it = uuid() # FIXME: consider throwing error if @it not set, as somethin ain't right
      return @it
    )

    type = type || 'meta'
    type = 'meta' if type isnt 'impression' and type isnt 'event' and type isnt 'meta'

    data.type = type

    img = new Image()
    src = 'http://localhost:1337/bat.gif?'

    console.log 'Sending data.', data

    src += 'data=' + encodeURIComponent JSON.stringify data
    src += '&'

    # cache buster
    src += Date.now()

    # add src to image which requests image
    img.src = src

    console.log 'Created image src.', src

    return @


  # expose to window
  window.Atlas = new Atlas _BA

) window._BA || {}