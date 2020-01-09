module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalpreco = oldCart.totalpreco || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, preco: 0};
        }
        storedItem.qty++;
        storedItem.preco = storedItem.item.preco * storedItem.qty;
        this.totalQty++;
        this.totalpreco += storedItem.item.preco;
    }

    this.generateArray = function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
}