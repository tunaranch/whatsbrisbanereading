(function ($) {


	/** For a book received, construct the html and add it to the page.  */
	$.fn.loadBookData = function () {


		return this.each(function () {

			function bookReceived(book, container) {
				var bookContainer = $('<div></div>', {
					"class": 'span3 book'
				}).appendTo(container);

				var infoContainer = $("<div></div>", {
					class: "info"
				}).appendTo(bookContainer);

				infoContainer.append(
					$("<h3></h3>", { text: book.title }),
					$("<h4></h4>", {text: book.author}),

					$("<p></p>", {html: $("<img>", {src: book.imageLink})}),
					$("<p></p>", {class: "blurb", html: book.blurb})
				)

				infoContainer.after(
					$("<p></p>", {class: "btn-group" }
					).append(
							$("<a></a>", {class: "btn", "text": "eLibCat", href: book.eLibcatUrl }),
							$("<a></a>", {class: "btn", "text": "Google Books", href: book.googleBooksUrl })
						)
				);

			}

			/** Get the top 10 list. Iterate over the BCC book list, and then call Google Books API to get extra data. */
			function getBooks(container) {

				var request = $.ajax({
					url: 'http://opendata.linkdigital.com.au/api/action/datastore_search_sql?sql=SELECT%20*%20FROM%20%2299bee72f-4a19-44f0-946b-2adc56ef199e%22%20WHERE%20%22Week%20Ending%22%20=%20(SELECT%20%20MAX(%22Week%20Ending%22)%20FROM%20%2299bee72f-4a19-44f0-946b-2adc56ef199e%22)'
				});

				request.done(function (data) {
					if (data.success) {

						var books = data.result.records;

						$(books).each(function (i, book) {
							var defaultBook = {
								author: book["Book Author"],
								title: book["Book Title"],
								imageLink: "", //TODO: Not found
								blurb: "No description available",
								eLibcatUrl: book["eLibcat Link"],
								googleBooksUrl: ""}; //TODO: not found image

							var googleBookLookup = $.ajax({
								url: 'https://www.googleapis.com/books/v1/volumes?q=inauthor:{author} intitle:{title}&fields=items(volumeInfo(description,imageLinks,canonicalVolumeLink))&maxResults=1',
								tokens: { author: defaultBook.author, title: defaultBook.title}
							});

							googleBookLookup.done(function (bookData) {
								defaultBook.imageLink = bookData.items[0].volumeInfo.imageLinks.thumbnail;
								defaultBook.blurb = bookData.items[0].volumeInfo.description;
								defaultBook.googleBooksUrl = bookData.items[0].volumeInfo.canonicalVolumeLink
								console.log("Pushing defaultBook:");

								bookReceived(defaultBook, container)

							});


						}); // each()
					}


				});
			}

			getBooks(this)
		});
	};


}(jQuery));