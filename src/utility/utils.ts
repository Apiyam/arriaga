export const formatDate = (date: string, isLong = false) => {
    if(!date) return "--";
    if(isLong) {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    }
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("id", "166");
    formData.append("type", "img"+(Math.random()*1000000).toString());
    const response = await fetch("https://peru-hippopotamus-889756.hostingersite.com/default.php", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    return data.url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

export const parseAmount = (amount: number | string) => {
    if(typeof amount === "string") {
        amount = parseFloat(amount);
    }
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}