---
title: '我的第一篇文章'
date: '2024-01-01 20:10:00'
thumbnail: '/images/background.jpg'
categories:
  - 前端
  - 教程
tags:
  - Next.js
  - Markdown
---

## Headers

## This is a Heading h2

<!--more-->

### Test heading h3 `inline code`

#### h4

Below is a HR

---

Above is a HR

##### h5

###### This is a Heading h6

## Emphasis

_This text will be italic_
_This will also be italic_

**This text will be bold**
**This will also be bold**

_You **can** combine them_

中文中**重点内容**的加粗与*斜体*的使用

<br>

Aso support <u>underline</u> and ~~strikethrough~~

Here is a kbd example: <kbd>Ctrl</kbd> + <kbd>C</kbd> and <kbd>Command</kbd> + <kbd>V</kbd> and <kbd>Arrow up</kbd> and <kbd>Arrow down</kbd>

这是 ==高亮文本==。

H~2~O, E=mc^2^

HTML and CSS abbreviations expose their meaning on hover or keyboard focus.

\*[HTML]: HyperText Markup Language

\*[CSS]: Cascading Style Sheets

Smart punctuation turns ranges like 2024--2026 into an en dash, and breaks---like this---into em dashes.

Emoji shortcodes work with GitHub-style names: :wink: :cry: :sparkles:

### Notes

A note [^1] and another note [^2]

[^1]: This is a note

[^2]: This is another note

### Task Lists

- [ ] to do
- [x] done
- [ ] review custom Markdown rendering

<details>
<summary>点击展开</summary>

这里是默认 web 原生版本可折叠的内容。

- 支持列表
- 支持 **Markdown**

</details>

[details="点击展开"]

这里是 Discourse 版本可折叠的内容。

- 支持列表
- 支持 **Markdown**

[/details]

### Special Quotes

Use fenced admonitions for callouts:

```md
::: warning Optional title
Content supports **Markdown**.
:::
```

::: info
This is an info callout.
:::

::: tip
This is a tip with **Markdown** inside.
:::

::: warning Pay attention
This is a warning callout that wraps on small screens and works in light and dark mode.
:::

::: danger
This is a danger callout.
:::

## Lists

### Unordered

- Item 1
- Item 2
- Item 2a
- Item 2b
- Nested items keep readable spacing:
  - Child item
  - Another child item

### Ordered

1. Item 1
2. Item 2
3. Item 3
   1. Item 3a
   2. Item 3b

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Images

Discourse-style image metadata can control size and layout:

```md
![Centered sample|640x360, 75%](/images/background.jpg)
![Left wrapped sample|320x180, left](/images/background.jpg)
![Wide sample|wide](/images/background.jpg)
```

![Centered sample|640x360, 75%](/images/background.jpg)

![Left wrapped sample|320x180, left](/images/background.jpg)

This paragraph wraps around the left image on larger screens while still stacking cleanly on mobile.

![Wide sample|wide](/images/background.jpg)

Click any Markdown image to open a larger preview.

Discourse-style image grids:

```md
[grid]
![Grid sample 1|640x360](/images/background.jpg)
![Grid sample 2|480x720](/images/avatar.jpg)
![Grid sample 3|640x640](/images/copyright.png)
![Grid sample 4|640x520](/images/projects/deep-learning.jpg)
![Grid sample 5|420x560](/images/background.jpg)
![Grid sample 6|640x430](/images/avatar.jpg)
[/grid]
```

[grid]
![Grid sample 1|640x360](/images/background.jpg)
![Grid sample 2|480x720](/images/avatar.jpg)
![Grid sample 3|640x640](/images/copyright.png)
![Grid sample 4|640x520](/images/projects/deep-learning.jpg)
![Grid sample 5|420x560](/images/background.jpg)
![Grid sample 6|640x430](/images/avatar.jpg)
[/grid]

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
> > Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns | Right columns |
| ------------ | :-----------: |
| left foo     |   right foo   |
| left bar     |   right bar   |
| left baz     |   right baz   |

## Blocks of code

```typescript
const message = 'Hello world'
alert(message)
const testInt: number = 120
```

## Inline code

This web site is using `markedjs/marked`.
