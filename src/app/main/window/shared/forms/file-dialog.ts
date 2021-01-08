function listenDialogClose(input, callback) {
    let closed = false;

    const onDialogClose = () => {
        if (closed) { return; }
        closed = true;
        setTimeout(() =>  {
            window.removeEventListener('focus', onDialogClose);
            callback();
        }, 500);
    };

    window.addEventListener('focus', onDialogClose);
    input.addEventListener('change', onDialogClose);
}

export async function selectFileDialog(accept): Promise<File | null> {
    const input = document.createElement('input') as HTMLInputElement;

    input.type = 'file';
    input.accept = accept;

    return new Promise((res) => {
        listenDialogClose(input, () => res(null));
        input.addEventListener('change', () => res(input.files ? input.files.item(0) : null));
        input.click();
    });
}
