wheel(
    'simulator.includes.screen',
    [
        '#define MODULE_SCREEN        1',
        '',
        '#define SCREEN_CLEAR         0',
        '#define SCREEN_FILL          1',
        '#define SCREEN_FILL_COLOR    2',
        '#define SCREEN_SET_TEXT_SIZE 3',
        '#define SCREEN_DRAW_PIXEL    4',
        '#define SCREEN_DRAW_NUMBER   5',
        '#define SCREEN_DRAW_TEXT     6',
        '#define SCREEN_DRAW_LINE     7',
        '#define SCREEN_DRAW_RECT     8',
        '#define SCREEN_DRAW_CIRCLE   9',
        '#define SCREEN_DRAW_IMAGE    10',
        '',
        '#define WHITE                0',
        '#define BLACK                1',
        '',
        'proc clearScreen()',
        '    module   MODULE_SCREEN,          SCREEN_CLEAR',
        'endp',
        '',
        'proc setFill(number fill)',
        '    record SetFill',
        '        number fill',
        '    endr',
        '    SetFill setFill',
        '    asm',
        '        set      setFill.fill,           fill',
        '        addr     setFill',
        '        module   MODULE_SCREEN,          SCREEN_FILL',
        '    end',
        'endp',
        '',
        'proc setFillColor(number fillColor)',
        '    record SetFillColor',
        '        number fillColor',
        '    endr',
        '    SetFillColor setFillColor',
        '    asm',
        '        set      setFillColor.fillColor, fillColor',
        '        addr     setFillColor',
        '        module   MODULE_SCREEN,          SCREEN_FILL_COLOR',
        '    end',
        'endp',
        '',
        'proc setTextSize(number textSize)',
        '    record SetTextSize',
        '        number textSize',
        '    endr',
        '    SetTextSize setTextSize',
        '    asm',
        '        set      setTextSize.textSize,   textSize',
        '        addr     setTextSize',
        '        module   MODULE_SCREEN,          SCREEN_SET_TEXT_SIZE',
        '    end',
        'endp',
        '',
        'proc drawPixel(number x, number y)',
        '    record DrawPixel',
        '        number   x, y',
        '    endr',
        '    DrawPixel drawPixel',
        '    asm',
        '        set      drawPixel.x,            x',
        '        set      drawPixel.y,            y',
        '        addr     drawPixel',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_PIXEL',
        '    end',
        'endp',
        '',
        'proc drawNumber(number x, number y, number n)',
        '    record DrawNumber',
        '        number   x, y, n',
        '    endr',
        '    DrawNumber drawNumber',
        '    asm',
        '        set      drawNumber.x,           x',
        '        set      drawNumber.y,           y',
        '        set      drawNumber.n,           n',
        '        addr     drawNumber',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_NUMBER',
        '    end',
        'endp',
        '',
        'proc drawText(number x, number y, string s)',
        '    record DrawText',
        '        number   x, y',
        '        string   s',
        '    endr',
        '    DrawText drawText',
        '    asm',
        '        set      drawText.x,             x',
        '        set      drawText.y,             y',
        '        set      drawText.s,             s',
        '        addr     drawText',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_TEXT',
        '    end',
        'endp',
        '',
        'proc drawLine(number x1, number y1, number x2, number y2)',
        '    record DrawLine',
        '        number   x1, y1, x2, y2',
        '    endr',
        '    DrawLine drawLine',
        '    asm',
        '        set      drawLine.x1,            x1',
        '        set      drawLine.y1,            y1',
        '        set      drawLine.x2,            x2',
        '        set      drawLine.y2,            y2',
        '        addr     drawLine',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_LINE',
        '    end',
        'endp',
        '',
        'proc drawRect(number x, number y, number width, number height)',
        '    record DrawRect',
        '        number   x, y, width, height',
        '    endr',
        '    DrawRect drawRect',
        '    asm',
        '        set      drawRect.x,             x',
        '        set      drawRect.y,             y',
        '        set      drawRect.width,         width',
        '        set      drawRect.height,        height',
        '        addr     drawRect',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_RECT',
        '    end',
        'endp',
        '',
        'proc drawCircle(number x, number y, number radius)',
        '    record DrawCircle',
        '        number   x, y, radius',
        '    endr',
        '    DrawCircle drawCircle',
        '    asm',
        '        set      drawCircle.x,           x',
        '        set      drawCircle.y,           y',
        '        set      drawCircle.radius,      radius',
        '        addr     drawCircle',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_CIRCLE',
        '    end',
        'endp',
        '',
        'proc drawImage(number x, number y, string filename)',
        '    record DrawImage',
        '        number   x, y',
        '        string   filename',
        '    endr',
        '    DrawImage drawImage',
        '    asm',
        '        set      drawImage.x,            x',
        '        set      drawImage.y,            y',
        '        set      drawImage.filename,     filename',
        '        addr     drawImage',
        '        module   MODULE_SCREEN,          SCREEN_DRAW_IMAGE',
        '    end',
        'endp'
    ]
);
