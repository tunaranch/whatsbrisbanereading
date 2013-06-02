(function ($) {


	$.fn.loadBookData = function () {

		return this.each(function () {
			console.log("Loading book data into:");
			console.log(this)

			var container = this

			var request = $.ajax({
				url: 'http://opendata.linkdigital.com.au/api/action/datastore_search_sql?sql=SELECT%20*%20FROM%20%2299bee72f-4a19-44f0-946b-2adc56ef199e%22%20WHERE%20%22Week%20Ending%22%20=%20(SELECT%20%20MAX(%22Week%20Ending%22)%20FROM%20%2299bee72f-4a19-44f0-946b-2adc56ef199e%22)'

			});

			request.done(function (data) {
				console.log(data.result.records);
				var books = data.result.records;
				$(books).each(function (i, book) {


					var bookContainer = $('<div></div>', {
						"class": 'span3 book'
					}).appendTo(container);

					var infoContainer = $("<div></div>", {
						class: "info"
					}).appendTo(bookContainer);

					var title = book["Book Title"];
					var author = book["Book Author"]
					var imageLink = "" //TODO: Not found
					var blurb = "Not found"
					var googleBooksUrl = ""


					var googleBookLookup = $.ajax({
						url: 'https://www.googleapis.com/books/v1/volumes?q=inauthor:{author} intitle:{title}&fields=items(volumeInfo(description,imageLinks,canonicalVolumeLink))&maxResults=1',
						tokens: { author: author, title: title}

					});

					googleBookLookup.done(function (bookData) {
						console.log(bookData);
						//TODO: Check if there is a result first...
						imageLink = bookData.items[0].volumeInfo.imageLinks.thumbnail;
						blurb = bookData.items[0].volumeInfo.description;
						googleBooksUrl = bookData.items[0].volumeInfo.canonicalVolumeLink


						infoContainer.append(
							$("<h3></h3>", { text: title }),
							$("<h4></h4>", {text: author}),

							$("<p></p>", {html: $("<img>", {src: imageLink})}),
							$("<p></p>", {class: "blurb", html: blurb})
						)

						infoContainer.after(
							$("<p></p>", {class: "btn-group" }
							).append(
									$("<a></a>", {class: "btn", "text": "eLibCat", href: book["eLibcat Link"] }),
									$("<a></a>", {class: "btn", "text": "Google Books", href: googleBooksUrl })
								)
						);

					});


				}); // each()

			});
		});
	};


}(jQuery));