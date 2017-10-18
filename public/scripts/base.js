$(function(){
  const navHeight = $('nav').outerHeight()
  $('.browse-lists').height(
    window.innerHeight - ($('nav').outerHeight() + $('header').outerHeight())
  )
})
