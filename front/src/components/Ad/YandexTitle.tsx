import React, { ChangeEvent, useEffect, useState } from 'react';
import { ITitle, TitlePosition } from './Ad';
import { useCampaign } from '../../store/context';


interface ITitleProps {
    groupIndex: number,
    adIndex: number,
    index: number,
}

export function removePunctuation(value: string) {
    // Регулярное выражение для поиска всех знаков препинания
    const regex = /[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>[\]\\|]/g;

    // Замена всех знаков препинания на пустую строку
    return value.replace(regex, '');
}

export function extractPunctuation(value: string) {
    // Регулярное выражение для поиска всех знаков препинания
    const regex = /[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>[\]\\|]/g;

    const matches = value.match(regex);

    return matches?.join("") || "";
}

export function extractSymbols(value: string) {
    // Регулярное выражение для поиска : ! " ;
    const regex = /[:!";]/g;

    // Метод match возвращает массив найденных символов
    const matches = value.match(regex);

    return matches?.join("") || ""; // Если ничего не найдено, возвращаем пустой массив
}


function YandexTitle({ groupIndex, adIndex, index }: ITitleProps) {

    const { campaign, setCampaign } = useCampaign();
    const title = campaign.groups[groupIndex].ads[adIndex].titles[index];

    const maxLength = index === 0 ? 56 : 30;


    const updateTitleField = <K extends keyof ITitle>(field: K, value: ITitle[K]) => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: g.ads.map((a, j) =>
                              j === adIndex
                                  ? {
                                        ...a,
                                        titles: a.titles.map((t, k) =>
                                            k === index
                                                ? { ...t, [field]: value }
                                                : t
                                        ),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    const removeTitle = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: g.ads.map((a, j) =>
                              j === adIndex
                                  ? {
                                        ...a,
                                        titles: a.titles.filter((t) => t.id !== a.titles[index].id),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    const calculateLength = (title: string): number => {
        switch (index) {
            case 0:
                return title.length
            case 1:
                return title.length - extractSymbols(title).length
            default:
                return title.length
        }
        
    }

    const changeFirstTitle = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value,
            errorDelta = 0
        
        const errorEl = e.target.nextSibling as HTMLElement;
        errorEl.innerHTML = ""

        if (e.target.classList.contains("error")) {
            errorDelta -= 1
        }
        e.target.classList.remove("error")

        e.target.value.split(" ").forEach(word => {
            if (removePunctuation(word).length > 22) {
                e.target.classList.add("error")
                errorEl.innerHTML = "В слове не должно быть больше 22 символов"
                errorDelta += 1
            }
        })
        
        setCampaign((prev) => ({
            ...prev,
            errorsCount: prev.errorsCount + errorDelta
        }))

        value = value.slice(0, maxLength)
        updateTitleField("title", value)
    }

    const changeSecondTitle = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value,
            errorDelta = 0
        
        const errorEl = e.target.nextSibling as HTMLElement;
        errorEl.innerHTML = ""
        if (e.target.classList.contains("errorWord")) {
            errorDelta -= 1
        }
        if (e.target.classList.contains("errorLength")) {
            errorDelta -= 1
        }
        if (e.target.classList.contains("errorPunctuation")) {
            errorDelta -= 1
        }
        e.target.classList.remove("errorWord")
        e.target.classList.remove("errorLength")
        e.target.classList.remove("errorPunctuation")

        value.split(" ").forEach(word => {
            if (removePunctuation(word).length > 22) {
                e.target.classList.add("errorWord")
                errorEl.innerHTML = "В слове не должно быть больше 22 символов"
                errorDelta += 1
            }
        })
        if (value.length > maxLength) {
            e.target.classList.add("errorLength")
            errorDelta += 1
        }
        if (extractPunctuation(value).length - extractSymbols(value).length > 15) {
            e.target.classList.add("errorPunctuation")
            if (errorEl.innerHTML) errorEl.innerHTML += "<br/>"
            errorEl.innerHTML += "В заголовке не должно быть больше 15 знаков препинания"
            errorDelta += 1
        }
        
        setCampaign((prev) => ({
            ...prev,
            errorsCount: prev.errorsCount + errorDelta
        }))

        updateTitleField("title", value)
    }

    return (
        <div className="title">
            Заголовок {index + 1}
            <div className="input-limit" style={{color: calculateLength(title.title) >= maxLength ? "red": ""}}>{calculateLength(title.title)}</div>
            <input type="text" name={`group-${groupIndex}-ad-${adIndex}-title-${index}`}  className="title-input" value={title.title} onChange={index === 0 ? changeFirstTitle : changeSecondTitle} 
                required={(index > 2 && campaign.type === "Google") || (index > 0 && campaign.type === "Yandex")  ? false : true} />
            <div className="error" style={{color: "red"}}></div>
            <button style={{display: index < 3 || campaign.type === "Google" ? "none" : ""}} onClick={removeTitle}>Удалить</button>
        </div>
    );
  }
  
export default YandexTitle;
  