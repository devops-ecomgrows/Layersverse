enum MessType {
  Info = "info",
  Error = "error",
  Success = "success",
  Warning = "warning",
}

const status = {
  success: {
    icon: `<svg class="message-icon-success" x-description="Heroicon name: solid/check-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>`,
    color: `green`,
  },
  error: {
    icon: `<svg class="message-icon-error" x-description="Heroicon name: solid/x-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
</svg>`,
    color: `red`,
  },
  info: {
    icon: `<svg class="message-icon-info" x-description="Heroicon name: solid/information-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
</svg>`,
    color: `blue`,
  },
  warning: {
    icon: `<svg class="message-icon-warning" x-description="Heroicon name: solid/exclamation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
</svg>`,
    color: `yellow`,
  },
};

class Message {
  private containerElem: HTMLDivElement | null = null;
  constructor() {
    this.createContainer();
  }

  /**
   * @description Create new message-wrapper div
   */
  private createContainer() {
    let node = document.querySelector("#message-wrapper") as HTMLDivElement;

    if (!node) {
      node = document.createElement("div");
      node.id = "message-wrapper";
      node.appendChild;
      document.body.appendChild(node);
    }
    this.containerElem = node;
  }

  /**
   * @description Initialize content into message-wrapper div
   * @param type
   * @param content
   * @returns
   */
  private generate(type: MessType, content: string) {
    if (!this.containerElem) {
      return;
    }
    const node = document.createElement("div");
    node.classList.add(`message`, `${type}`);
    node.innerHTML = `<div class="message-container-${type}">
  <div class="flex">
    <div class="flex-shrink-0">
      ${status[type].icon}
    </div>
    <div class="ml-3">
      <h3 class="message-text-${type}">
        ${content}
      </h3>
    </div>
  </div>
</div>`;

    this.containerElem.appendChild(node);
    this.destroyAfterAnimationEnd(node);
  }

  private destroyAfterAnimationEnd(node: HTMLDivElement) {
    node.addEventListener("transitionend", () => {
      node.remove();
    });
    setTimeout(() => {
      node.classList.add("out");
    }, 2000);
  }

  info(content: string) {
    this.generate(MessType.Info, content);
  }
  success(content: string) {
    this.generate(MessType.Success, content);
  }
  error(content: string) {
    this.generate(MessType.Error, content);
  }
  warning(content: string) {
    this.generate(MessType.Warning, content);
  }
}

let messageInstance: Message;

const getInst = () => {
  if (!messageInstance) {
    messageInstance = new Message();
  }

  return messageInstance;
};

export const minfo = (content: string): void => {
  getInst().info(content);
};
export const msuccess = (content: string): void => {
  getInst().success(content);
};
export const merror = (content: string): void => {
  getInst().error(content);
};
export const mwarning = (content: string): void => {
  getInst().warning(content);
};
