<template lang="pug">
main
  +if tip!==false
    i
      p
        +if tip
          b
            i {@html tip}
            | 按序点击下图中对应图标
          +elseif tip === undefined
            | 验证码加载中 ⋯
          +else
            | 验证中 ⋯
      +if tip
        button(@click=get title="刷新")
    b(@&b class:Wait=!tip)
    +else
      svg(height="100" style="padding: 64px 0" width="100")
        path(d="m20 50 20 20 40-40" style="animation: ok 0.9s ease forwards")
        style.
</template>

<style lang="stylus">
@keyframes ok
	to
		stroke-dashoffset 0

main
	user-select none
	width 350px
	display flex
	flex-direction column
	align-items center

	&>svg>path
		fill none
		stroke green
		stroke-linecap round
		stroke-linejoin round
		stroke-width 8
		stroke-dasharray 100
		stroke-dashoffset 100

	&>i
		width 100%
		display flex
		align-items center
		box-sizing border-box
		padding 0 8px
		justify-content space-between

		&>p
			font-size 18px
			font-style normal
			margin 8px 0

			&>b
				font-weight 400
				line-height 1.5
				display flex

				&>i
					vertical-align middle
					margin-right 8px
					display inline-flex
					flex 1

					&>:global(svg)
						color #ff3e00
						margin 0 4px
						opacity 0.9
						padding 2px
						width 18px

						&:first-child
							margin-left 0

		&>button
			background var(--svgRefresh) 50% 50% / 16px no-repeat
			flex-shrink 0
			padding 0
			height 24px
			width 30px
			border-radius 18px
			border 2px solid #000
			opacity 0.5
			box-shadow 0 0 3px #999 inset
			cursor pointer
			margin 8px 0 8px 8px

			&:hover
				opacity 1
				filter var(--hF)

	&>b
		width 350px
		height 350px
		background-size 96px
		cursor pointer
		display block
		position relative

		&>:global(b)
			background rgba(255, 0, 0, 0.9)
			align-items center
			border 3px solid #fff
			border-radius 15px
			box-shadow inset 0 0 7px #00000080
			color #fff
			cursor var(--svgXs) 10 10, pointer
			display flex
			font-family 'h'
			font-style normal
			font-weight 600
			font-variation-settings 'wght' 900
			font-size 16px
			height 24px
			justify-content center
			padding 0
			position absolute
			user-select none
			width 24px

			&:hover
				background #eee
				color #666
				border-color red
				box-shadow inset 0 0 7px red
</style>

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
