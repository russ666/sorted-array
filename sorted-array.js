var SortedArray = (function () {
    var SortedArray = defclass({
        constructor: function (array, compare) {
            this.array   = [];
            this.compare = compare || compareDefault;
            var length   = array.length;
            var index    = 0;

            while (index < length) this.insert(array[index++]);
        },
        insert: function (element) {
            var array   = this.array;
            var compare = this.compare;
            var index   = array.length;

            array.push(element);

            while (index > 0) {
                var i = index, j = --index;

                if (compare(array[i], array[j]) < 0) {
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }

            return this;
        },
        rangeStart: function (element) {
            var length = this.array.length;
            if (length == 0) return -1;
            var index = this.search(element);

            while (index > 0) {
                if (this.compare(this.array[index], element) < 0) break;
                index -= 1;
            }

            return index;
        },
        rangeEnd: function (element) {
            var length = this.array.length;
            if (length == 0) return -1;
            var index = this.search(element);

            while (index < length-1) {
                if (this.compare(this.array[index], element) > 0) break;
                index += 1;
            }

            return index;
        },
        search: function (element) {
            var array   = this.array;
            var compare = this.compare;
            var high    = array.length;
            var low     = 0;

            while (high > low) {
                var index    = (high + low) / 2 >>> 0;
                var ordering = compare(array[index], element);

                if (ordering < 0) low = index + 1;
                    else if (ordering > 0) high = index;
                    else return index;
            }

            return index;
        },
        range: function (from, to) {
            var result = [];
            var length = this.array.length;

            if (length == 0) return result;

            from = (from == null || from == undefined) ? null : from;
            to = (to == null || to == undefined) ? null : to;

            var fromIndex = from == null ? 0 : this.rangeStart(from);
            var toIndex = to == null ? length-1 : this.rangeEnd(to);

            if (fromIndex == -1) return result;

            while (fromIndex <= toIndex)
            {
                var valid = true;
                var value = this.array[fromIndex];

                if (from != null)
                {
                    valid = this.compare(value, from) >= 0;
                }

                if (valid && to != null)
                {
                    valid = this.compare(value, to) < 0;
                }

                if (valid) result.push(value);

                fromIndex += 1;
            }

            return result;
        },
        remove: function (element) {
            var index = this.search(element);
            if (index >= 0) this.array.splice(index, 1);
            return this;
        }
    });

    SortedArray.comparing = function (property, array) {
        return new SortedArray(array, function (a, b) {
            return compareDefault(property(a), property(b));
        });
    };

    return SortedArray;

    function defclass(prototype) {
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    }

    function compareDefault(a, b) {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    }
}());

if (typeof module === "object") module.exports = SortedArray;
if (typeof define === "function" && define.amd) define(SortedArray);