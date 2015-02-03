browserify = ./node_modules/browserify/bin/cmd.js
watchify = ./node_modules/watchify/bin/cmd.js
stylus =  ./node_modules/stylus/bin/stylus
nib = ./node_modules/nib/
uglify = ./node_modules/uglify-js/bin/uglifyjs

default: js css

js:
	 $(browserify) pub/js/app.js -d -o | $(uglify) > pub/js/bundle.js

wjs:
	 $(watchify) pub/js/app.js -d -o pub/js/bundle.js -v

css:
	mkdir -p pub/css
	$(stylus) --compress -u $(nib) src/styl/screen.styl -o pub/css/

wcss:
	$(stylus) --watch --line-numbers src/styl/screen.styl -u $(nib) -o pub/css/
