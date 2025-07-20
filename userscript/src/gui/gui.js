import './style.css'

export default {
    inited: false,
    scanner: null,

    create(el, id, text) {
        const obj = document.createElement(el)
        if (id) obj.className = id + '-smartass';
        if (text) obj.textContent = text;

        return obj;
    },

    dragify() {
        let dragging = false;
        let startX, startY;

        const drag = this.create('div', 'dragger');
        this.scanner.appendChild(drag);

        drag.addEventListener('mousedown', (e) => {
            const button = this.scanner.querySelector('.scan-btn-smartass');
            const responseArea = this.scanner.querySelector('.output-smartass');

            if (e.target === button ||
                e.target === responseArea ||
                responseArea.contains(e.target)
            ) return;

            dragging = true;
            startX = e.clientX - this.scanner.offsetLeft;
            startY = e.clientY - this.scanner.offsetTop;

            const mousemove = (e) => {
                if (!dragging) return;

                const newLeft = Math.max(0, Math.min(
                    window.innerWidth - this.scanner.offsetWidth,
                    e.clientX - startX
                ));

                const newTop = Math.max(30, Math.min(
                    window.innerHeight - this.scanner.offsetHeight,
                    e.clientY - startY
                ));

                this.scanner.style.left = newLeft + 'px';
                this.scanner.style.top = newTop + 'px';
            };

            const mouseup = () => {
                dragging = false;
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseup);
            };

            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);

            e.preventDefault();
        });
    },

    resizeify() {
        const corners = ['se', 'sw', 'ne', 'nw'];
        const sides = ['n', 's', 'w', 'e'];

        const points = [...corners, ...sides];

        let resizing = false;
        let holding = null;

        let startX, startY;
        let startWidth, startHeight;
        let startLeft, startTop;

        corners.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-smartass corner ${pos}`;

            switch(pos) {
                case 'se':
                    handle.style.cssText = `
                        bottom: -5px;
                        right: -5px;
                        width: 10px;
                        height: 10px;
                        cursor: se-resize;
                    `;
                    break;
                case 'sw':
                    handle.style.cssText = `
                        bottom: -5px;
                        left: -5px;
                        width: 10px;
                        height: 10px;
                        cursor: sw-resize;
                    `;
                    break;
                case 'ne':
                    handle.style.cssText = `
                        top: -5px;
                        right: -5px;
                        width: 10px;
                        height: 10px;
                        cursor: ne-resize;
                    `;
                    break;
                case 'nw':
                    handle.style.cssText = `
                        top: -5px;
                        left: -5px;
                        width: 10px;
                        height: 10px;
                        cursor: nw-resize;
                    `;
                    break;
            }

            this.scanner.appendChild(handle);
        });

        sides.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-smartass edge ${pos}`;

            switch(pos) {
                case 'n':
                    handle.style.cssText = `
                        top: -5px;
                        left: 10px;
                        right: 10px;
                        height: 10px;
                        cursor: n-resize;
                    `;
                    break;
                case 's':
                    handle.style.cssText = `
                        bottom: -5px;
                        left: 10px;
                        right: 10px;
                        height: 10px;
                        cursor: s-resize;
                    `;
                    break;
                case 'w':
                    handle.style.cssText = `
                        left: -5px;
                        top: 10px;
                        bottom: 10px;
                        width: 10px;
                        cursor: w-resize;
                    `;
                    break;
                case 'e':
                    handle.style.cssText = `
                        right: -5px;
                        top: 10px;
                        bottom: 10px;
                        width: 10px;
                        cursor: e-resize;
                    `;
                    break;
            }

            this.scanner.appendChild(handle);
        });

        points.forEach(pos => {
            const handle = this.scanner.querySelector(`.resize-smartass.${pos}`);
            handle.addEventListener('mousedown', (e) => {
                resizing = true;
                holding = pos;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(window.getComputedStyle(this.scanner).width, 10);
                startHeight = parseInt(window.getComputedStyle(this.scanner).height, 10);
                startLeft = this.scanner.offsetLeft;
                startTop = this.scanner.offsetTop;

                const mousemove = (e) => {
                    if (!resizing) return;

                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newLeft = startLeft;
                    let newTop = startTop;

                    switch(holding) {
                        case 'se':
                            newWidth = Math.max(50, startWidth + dx);
                            newHeight = Math.max(50, startHeight + dy);
                            break;
                        case 'sw':
                            newWidth = Math.max(50, startWidth - dx);
                            newHeight = Math.max(50, startHeight + dy);
                            newLeft = Math.max(0, startLeft + dx);
                            break;
                        case 'ne':
                            newWidth = Math.max(50, startWidth + dx);
                            newHeight = Math.max(50, startHeight - dy);
                            newTop = Math.max(30, startTop + dy);
                            break;
                        case 'nw':
                            newWidth = Math.max(50, startWidth - dx);
                            newHeight = Math.max(50, startHeight - dy);
                            newLeft = Math.max(0, startLeft + dx);
                            newTop = Math.max(30, startTop + dy);
                            break;
                        case 'n':
                            newHeight = Math.max(50, startHeight - dy);
                            newTop = Math.max(30, startTop + dy);
                            break;
                        case 's':
                            newHeight = Math.max(50, startHeight + dy);
                            break;
                        case 'w':
                            newWidth = Math.max(50, startWidth - dx);
                            newLeft = Math.max(0, startLeft + dx);
                            break;
                        case 'e':
                            newWidth = Math.max(50, startWidth + dx);
                            break;
                    }

                    if (newLeft + newWidth > window.innerWidth) {
                        newWidth = window.innerWidth - newLeft;
                    }

                    if (newTop + newHeight > window.innerHeight) {
                        newHeight = window.innerHeight - newTop;
                    }

                    this.scanner.style.width = newWidth + 'px';
                    this.scanner.style.height = newHeight + 'px';
                    this.scanner.style.left = newLeft + 'px';
                    this.scanner.style.top = newTop + 'px';
                };

                const mouseup = () => {
                    resizing = false;
                    holding = null;
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                };

                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);

                e.preventDefault();
                e.stopPropagation();
            });
        });
    },

    init() {
        if (this.inited) return;

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => this.load(true);
        document.head.appendChild(script);
    },

    load(already) {
        if (!already) {
            this.init();
            return;
        }

        this.inited = true;

        this.scanner = this.create('div', 'scanner');

        const scan = this.create('button', 'scan-btn', 'scan');
        const output = this.create('div', 'output');

        this.scanner.appendChild(scan);
        this.scanner.appendChild(output);

        this.resizeify();
        this.dragify();

        scan.addEventListener('click', async (e) => {
            e.stopPropagation();

            scan.textContent = '...';
            scan.disabled = true;

            try {
                output.style.display = 'none';
                this.scanner.style.display = 'none';

                const image = await html2canvas(document.body, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    logging: false,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    scrollX: 0,
                    scrollY: 0
                });

                this.scanner.style.display = 'block';

                const canvas = this.create('canvas');
                const context = canvas.getContext('2d');

                const rect = this.scanner.getBoundingClientRect();

                canvas.width = rect.width - 4;
                canvas.height = rect.height - 4;

                context.drawImage(
                    image,
                    rect.left + 2,
                    rect.top + 2,
                    rect.width - 4,
                    rect.height - 4,
                    0, 0,
                    rect.width - 4,
                    rect.height - 4
                );

                const res = await fetch('http://localhost:34781/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: canvas.toDataURL('image/png')
                    })
                });

                const json = await res.json();
                if (json.success) {
                    output.style.display = 'block';
                    output.innerHTML = `
                        <div style="position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #4CAF50;"></div>
                        <div style="margin-bottom: 10px;">
                            <strong>Message:</strong> ${result.message}
                        </div>
                        ${result.data ? `<div><strong>Data:</strong> ${result.data}</div>` : ''}
                    `;
                } else {
                    output.style.display = 'block';
                    output.innerHTML = `
                        <div style="position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #F44336;"></div>
                        <div>${result.message}</div>
                    `;
                }
            } catch(e) {
                output.style.display = 'block';
                output.innerHTML = `
                    <div style="position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #F44336;"></div>
                    <div>Error: ${e.message}</div>
                `;
            } finally {
                scan.textContent = 'scan';
                scan.disabled = false;
            }
        });

        document.body.appendChild(this.scanner);
    }
}