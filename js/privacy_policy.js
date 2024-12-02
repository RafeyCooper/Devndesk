$.fn.commentCards = function () {
    return this.each(function () {
        console.log(this);
        var $this = $(this),
            $cards = $this.find('.card'),
            $current = $cards.filter('.card--current'),
            $next;

        let startY = 0;
        let endY = 0;
        const threshold = 100; // Threshold to detect a significant drag

        // Function to handle card transitions
        function goToNextCard() {
            // Ensure the next card is always correctly calculated
            $cards.removeClass('card--current card--out card--next');
            $current.addClass('card--out');
            $current = $current.next().length ? $current.next() : $cards.first(); // Get the next card
            $current.addClass('card--current');
            $next = $current.next().length ? $current.next() : $cards.first(); // Ensure next card is correctly updated
            $next.addClass('card--next');
        }

        function handleVerticalSwipe() {
            console.log(startY - endY);
            if (startY - endY > threshold) {
                // Drag up (or swipe up)
                
                console.log("Swipe detected");
                goToNextCard();
            }
            else{
                console.log("Touch detected")
                goToNextCard()
            }
        }

        // Detect if the device supports touch
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Mouse and Touch events
        function startDrag(event) {
            if (event.type === 'touchstart') {
                startY = event.originalEvent.touches[0].clientY;
            } else if (event.type === 'mousedown') {
                startY = event.clientY;
                $(window).on('mousemove', dragMove);
                $(window).on('mouseup', endDrag);
            }
        }

        function dragMove(event) {
            if (event.type === 'touchmove') {
                endY = event.originalEvent.touches[0].clientY;
                event.preventDefault(); // Prevent scrolling during touch drag
            } else if (event.type === 'mousemove') {
                endY = event.clientY;
            }
        }

        function endDrag(event) {
            if (event.type === 'touchend') {
                handleVerticalSwipe();
            } else if (event.type === 'mouseup') {
                handleVerticalSwipe();
                $(window).off('mousemove', dragMove);
                $(window).off('mouseup', endDrag);
            }
        }

        // Attach events for touch and mouse only based on device type
        if (isTouchDevice) {
            console.log("Touch device");
            $cards.on('click', function () {
                console.log("Card clicked");
                goToNextCard()
            });

        } else {

            // console.log("Not Touch device");
            // $this.on('mousedown', startDrag);
            // $this.on('mousemove', dragMove);
            // $this.on('mouseup', endDrag);

            $cards.on('click', function () {
                // console.log("Card clicked");
                handleVerticalSwipe()
            });

        }

        // If no card is marked as current, set the first card as current
        if (!$current.length) {
            $current = $cards.first().addClass('card--current');
            $next = $current.next();
            $next = $next.length ? $next : $cards.first();
            $next.addClass('card--next');
        }

        $this.addClass('cards--active');
    });
};

// Initialize the card carousel
$('.cards').commentCards();




document.querySelectorAll('.toc-list a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Prevent the default anchor behavior (scrolling)

        const targetId = this.getAttribute('data-target'); // Get the ID from data-target
        const targetCard = document.getElementById(targetId);
        const currentCard = document.getElementsByClassName('card--current')[0];

        if (targetCard === currentCard) {
            return;
        }

        // Reset classes on all cards to ensure smooth animation
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('card--current'); // Remove 'current' class from all cards
            card.classList.remove('card--out');    // Remove any transition effects from other cards
            card.classList.remove('card--next');   // Remove the 'next' class as well
        });

        const $previous = $(targetCard).prev();
        if ($previous.length) {
            $previous.addClass('card--out');
        }
        else {
            $("#IMPORTANT_NOTICE").addClass('card--out');
        }

        targetCard.classList.add('card--current');

        const $next = $(targetCard).next();
        if ($next.length) {
            $next.addClass('card--next');
        }
        else {
            $("#COMMITMENT_TO_PROTECTING_YOUR_PRIVACY").addClass('card--next');
        }
        $('.cards').commentCards();
    });
});


$(document).ready(function () {
    $("#toggleBtn").on('click', function () {
        toggleTOC();
    });
});


function toggleTOC() {
    var tocList = document.getElementById("toc-list");
    if (tocList.classList.contains("show")) {
        tocList.classList.remove("show");
    } else {
        tocList.classList.add("show");
    }
}