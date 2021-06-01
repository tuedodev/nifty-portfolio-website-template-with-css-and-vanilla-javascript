function ready(func) {
	if (document.readyState != `loading`) {
		func();
	} else {
		document.addEventListener(`DOMContentLoaded`, func);
	}
}

ready(() => {
	// Elements and Variables
	const mainNavbar = document.querySelector(`nav.main-navigation`);
	const mainFooter = document.querySelector(`footer.main-footer`);
	let scrollObserverElement;
	const duration = 150;
	const degrees = 120;
	let socialMediaContainer, socialMedia, copyright, prevIntersectionRatio;
	let animationArray, copyrightAnimation;
	let lastY;

	const init = () => {
		if (mainNavbar && mainNavbar.classList.contains(`shrinkable`)) {
		}
		if (mainFooter) {
			footerAnimationInit();
		}
		scrollObserverElement = document.createElement('div');
		scrollObserverElement.setAttribute('id', 'scrollObserver');
		scrollObserverElement.setAttribute(
			'style',
			'position:absolute; top:0; right:2px; width:1px; height:1px; opacity:0;z-index: -1;'
		);
		document.body.appendChild(scrollObserverElement);
		monitorScrolling();
	};

	const monitorScrolling = () => {
		let scrollObserver = new IntersectionObserver(scrollEvent, {
			root: null,
			rootMargin: `0px`,
			threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0], //Array.from({ length: (1.0 - 0.0) / 0.05 + 1 }, (_, i) => 0.0 + i * 0.05), // Array with range from 0.0 to 1.0 step 0.01
		});
		scrollObserver.observe(scrollObserverElement);
	};

	const scrollEvent = (entries) => {
		if (entries.length > 0) {
			console.log(entries[0]);
			let y = entries[0].boundingClientRect.y;
			let viewportHeight = entries[0].rootBounds.height;
			let navbarHeight = mainNavbar.getBoundingClientRect().height;
			let offsetHeight = document.body.offsetHeight;

			if (y < 0) {
				// site was scrolled:
				// Check if below of the viewport is enough room greater than height of Navbar
				// only then shrink the Navbar

				if (offsetHeight - viewportHeight >= navbarHeight) {
					mainNavbar.classList.add(`shrinked`);
				}
			} else {
				// site was not scrolled: window.pageY = 0
				mainNavbar.classList.remove(`shrinked`);
			}
		}
	};

	const footerAnimationInit = () => {
		socialMediaContainer = mainFooter.querySelector(`.social-media-container`);
		socialMedia = Array.from(mainFooter.querySelectorAll(`.social-media`));
		copyright = mainFooter.querySelector(`p.copyright`);

		if (socialMedia && socialMedia.length > 0) {
			animationArray = socialMedia.map((item) => {
				let offset = calculateOffset(item);
				return item.animate(
					[
						{ transform: `translateX(${offset}px) rotate(${degrees}deg)` },
						{ transform: `translateX(0px) rotate(0deg)` },
					],
					{
						duration,
						iterations: 1,
					}
				);
			});
		}
		if (copyright) {
			copyrightAnimation = copyright.animate(
				[
					{ transform: `translateX(50px)`, letterSpacing: `15px`, textIndent: `15px` },
					{ transform: `translateX(0px)`, letterSpacing: `0px`, textIndent: `0px` },
				],
				{
					duration: 120,
					delay: duration,
					iterations: 1,
				}
			);
		}
		let footerObserver = new IntersectionObserver(footerAnimationEvent, {
			root: null,
			rootMargin: `20px`,
			threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0], //Array.from({ length: (1.0 - 0.0) / 0.05 + 1 }, (_, i) => 0.0 + i * 0.05), // Array with range from 0.0 to 1.0 step 0.01
		});
		footerObserver.observe(socialMediaContainer);
	};

	const calculateOffset = (item) => {
		let elemWidth = item.getBoundingClientRect().width;
		return Math.round((degrees / 360) * elemWidth * Math.PI);
	};

	const footerAnimationEvent = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				let scrollDown = lastY !== undefined ? lastY > entry.boundingClientRect.y : true;
				lastY = entry.boundingClientRect.y;
				if (scrollDown) {
					animationArray.forEach((item) => {
						item.play();
						item.onfinish = () => {
							// Add :hover animation to social media icons
							item.effect.target.classList.add('after-init-animation');
						};
					});

					copyrightAnimation.play();
					copyrightAnimation.onfinish = () => {
						copyrightAnimation.effect.target.setAttribute(
							'style',
							'transform: translateX(0px); letter-spacing: 0px; text-indent: 0px'
						);
					};
				}
			}
		});
	};

	init();
});
