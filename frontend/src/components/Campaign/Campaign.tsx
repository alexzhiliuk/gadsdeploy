import React, { FormEvent, FormEventHandler, useState } from 'react';
import googleLogo from '../../assets/images/logo.png';
import './campaign.scss';
import { generateInitialCampaign, getDefaultDescriptions, getDefaultTitles, inititalCampaign, useCampaign } from '../../store/context';

import Group, { IAd } from '../Group/Group';
import Input from '../Inputs/Input';
import axios from 'axios';


const headerData = {
    "Google": {
        logo: googleLogo,
        alt: "Google Ads",
        title: "Генератор объявлений Google AdWords"
    },
    "Yandex": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Yandex_Direct_icon.svg/2048px-Yandex_Direct_icon.svg.png",
        alt: "Google Ads",
        title: "Генератор объявлений Yandex"
    }
}

export interface IGroup {
    id?: number,
    title: string,
    keywords: string,
    ads: Array<IAd>
}

const Campaign: React.FC = () => {
    const { campaign, setCampaign } = useCampaign();

    const data = headerData[campaign.type];

    const addNewGroup = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: [
                ...prev.groups,
                { id: Date.now(), title: '', keywords: '', ads: [{
                    id: Date.now(), 
                    endUrl: '', path1: '', path2: '', trackingTemplate: '', 
                    titles: getDefaultTitles(campaign.type),
                    descriptions: getDefaultDescriptions(campaign.type)
                }] },
            ],
        }));
    };

    const updateCampaignTitle = (value: string) => {
        setCampaign((prev) => ({
            ...prev,
            title: value,
        }));
    };

    const submitData = async (campaignData: any) => {
        try {
            // const response = await fetch('http://127.0.0.1:5000', {
            const response = await fetch('https://api.ppczhiliuk.ru/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(campaignData), 
                mode: 'cors',
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Получаем заголовки ответа для извлечения имени файла
            const disposition = response.headers.get('Content-Disposition');
            let filename = 'campaign.xlsx'; // Имя по умолчанию

            if (disposition && disposition.indexOf('attachment') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            // Читаем бинарные данные (Blob)
            const blob = await response.blob();

            // Создаем ссылку и инициируем скачивание
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        
            // const responseData = await response.json();
            // console.log('Data submitted successfully:', responseData);
        } catch (error) {
            console.error('There was an error submitting the data:', error);
        }
    };

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        console.log(campaign)
        e.preventDefault();

        if (campaign.errorsCount === 0) {
            submitData(campaign)
            setCampaign(generateInitialCampaign(campaign.type))
        }
    }

    const changeCampaignType = () => {
        let confirm = window.confirm("Вы уверены? Данные введеные для данной кампании не сохранятся")
        if (confirm) setCampaign((prev) => (generateInitialCampaign(prev.type === "Google" ? "Yandex" : "Google")))
    }

    return (
        <>
            <div className="container">
                <button className="change-button" onClick={changeCampaignType}>Сменить</button>
            </div>
            <header className="header container">
                <div className="logo">
                    <img src={data.logo} alt={data.alt} />
                </div>
                <h1>{data.title}</h1>
            </header>
            <main>
                <form onSubmit={submitHandler} className='container'>
                    <Input label='Название кампании' inputName={`campaign-name`} required={true} value={campaign.title} onChangeCallback={updateCampaignTitle} />

                    {campaign.groups.map((group, i) => (
                        <Group key={group.id} index={i} />
                    ))}

                    <div className="bottom-btns">
                        <button type="button" onClick={addNewGroup} id="addGroup">Новая группа</button>
                        <button type="submit" className="generate-btn" onClick={() => {console.log(campaign)}}>СГЕНЕРИРОВАТЬ XLSX</button>
                    </div>
                    
                </form>
            </main>
        </>
    );
}
  
export default Campaign;
  