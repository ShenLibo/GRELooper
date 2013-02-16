var WordView = function(word, store) {
	this.initialize = function() {
        this.el = $('<div/>');
        this.el.on('click', '#hardnessInc-btn', this.hardnessInc);
        this.el.on('click', '#hardnessDec-btn', this.hardnessDec);

	}

	this.render = function() {
        this.el.html(WordView.template(word));
        return this;
    };

    this.hardnessInc = function() {
    	var newHardness = Number($('#hardness').text())+1
    	$('#hardness').text(newHardness)
    	store.updateHardnessById(id, newHardness)

    }
    this.hardnessDec = function() {
    	var newHardness = Number($('#hardness').text())-1
    	$('#hardness').text(newHardness)
    	store.updateHardnessById(id, newHardness)
    }

    this.initialize();
 
 }
 
WordView.template = Handlebars.compile($("#word-tpl").html());