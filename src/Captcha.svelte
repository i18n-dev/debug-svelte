<script lang="coffee">
> svelte > onMount
  -/srv.js > captcha captchaVerify CaptchaD
  -/lib/utf8d.js
  -/dom/_.js > Tag

< Y, I

+ tip,b,captcha_id

xy_li = []

id = 0

imgClick = (e)=>
  {layerX, layerY} = e
  xy_li.push layerX, layerY

  if id == 2
    tip = 0
    p = captchaVerify captcha_id, xy_li
    reset()
    try
      try
        r = await p
      catch err
        if err[0] == 3
          reset()
          render CaptchaD err[1]
          return
        throw err
      if r
        await Y(r)
        tip = false
        return
    catch
      ``
    get()
    return

  i = Tag 'b'
  i.innerText = ++id
  i.onclick = (e)=>
    id = i.innerText - 1
    xy_li.splice(id*2, xy_li.length)
    i.remove()
    for i from b.getElementsByTagName('b')
      if id - i.innerText  < 0
        i.remove()
    e.stopPropagation()
    return
  b.appendChild i
  i.style = "left:#{layerX-i.offsetWidth/2}px;top:#{layerY-i.offsetHeight/2}px"
  return

onMount =>
  if I
    render(I)
  else
    get()
  return

reset = =>
  id = 0
  xy_li = []
  b.innerHTML = ''
  b.removeAttribute('style')
  b.onclick = =>
  return

get = =>
  tip = undefined
  reset()
  render await captcha()
  return

render = ([_captcha_id, img, _tip])=>
  captcha_id = _captcha_id
  tip = utf8d(_tip).split('|').map(
    (d)=>
      """<svg viewBox="0 0 1024 1024"><path d="#{d}"></path></svg>"""
  ).join('')
  b.style.background = 'url("'+URL.createObjectURL(new Blob([img])).toString()+'") 0 0 / 350px no-repeat'
  b.onclick = imgClick
  return
</script>

<template lang="pug">

</template>

<style lang="stylus">

</style>
