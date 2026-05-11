function processSequence(queue) {
    if (!queue || queue.length === 0) return;

    const currentObj = queue.shift();
    if (typeof currentObj.fx === 'function') {
        currentObj.fx();
    }

    setTimeout(() => {
        processSequence(queue);
    }, currentObj.millis);
}

