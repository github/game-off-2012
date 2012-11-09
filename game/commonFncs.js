//KEEP THIS SHORT!
//IF THIS IS OVER 250 LINES THEN SPLIT IT INTO LOGICAL SECTIONS!

function merge(array, values) {
    if (values && values.length > 0)
        array = array.concat(values);
    return array;
}