import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import {ptBR} from 'date-fns/locale/pt-BR';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getEntry, addEntry } from '../services/Connect';
import './Entry.css';
registerLocale('pt-BR', ptBR);

const Info = () => {
    return (
        <div className="info-container">
            <h1>Código-fonte do projeto:</h1>
            <p>Back-end: <a href='https://github.com/nicholasyukio/phibra-back-end' target='_blank'>https://github.com/nicholasyukio/phibra-back-end</a></p>
            <p>Front-end: <a href='https://github.com/nicholasyukio/phibra-front-end' target='_blank'>https://github.com/nicholasyukio/phibra-front-end</a></p>
            <p><i>Desenvolvido por Nicholas Yukio Menezes Sugimoto</i></p>
        </div>
    )
}

const Entry = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newRecord, setNewRecord] = useState({ date: '', type: 'revenue', value: 0, user: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const total = records.reduce((sum, r) => r.type === 'revenue' ? sum + r.value : sum - r.value, 0);

    useEffect(() => {
        getEntry().then(setRecords);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Date:', newRecord.date);
        console.log('Type:', newRecord.type);
        console.log('Value:', newRecord.value);
        console.log('User:', newRecord.user);
        await addEntry(newRecord);
        setRecords(await getEntry());
        console.log(records);
        setNewRecord({ date: '', type: 'revenue', value: 0, user: '' });
        setSuccessMessage('Lançamento adicionado com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
          // Convertemos para string ISO (ex: '2025-04-10')
          const isoDate = date.toISOString().split('T')[0];
          setNewRecord({ ...newRecord, date: isoDate });
        }
    };

    const handleExportCSV = () => {
        if (records.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }
    
        const headers = ['CreatedAt', 'Date', 'Type', 'Value', 'User'];
        const rows = records.map(r =>
            [r.createdAt, r.date, r.type, r.value.toString(), r.user].join(',')
        );
        const csvContent = [headers.join(','), ...rows].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "lancamentos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className="entry-container">
            <h1>Lançamento de Receita/Despesa</h1>
            {successMessage && (
            <div className="success-message">
                {successMessage}
            </div>
            )}
            <form onSubmit={handleSubmit}>
                <label htmlFor="unit">Selecione o tipo do lançamento:</label>
                <select
                id="type"
                value={newRecord.type}
                onChange={e => setNewRecord({ ...newRecord, type: e.target.value })}
                >
                <option value="revenue">Receita</option>
                <option value="cost">Despesa</option>
                </select>
                <label htmlFor="date">Selecione a data do evento:</label>
                <DatePicker
                selected={newRecord.date ? parseISO(newRecord.date) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione a data"
                />
                {/* <input type="date" value={newRecord.date} onChange={e => setNewRecord({ ...newRecord, date: e.target.value })} /> */}
                <label htmlFor="value">Selecione o valor do lançamento:</label>
                <input type="number" value={newRecord.value} onChange={e => setNewRecord({ ...newRecord, value: parseInt(e.target.value) })} />
                <label htmlFor="user">Origem/Destino da Receita/Despesa:</label>
                <input type="text" value={newRecord.user} onChange={e => setNewRecord({ ...newRecord, user: e.target.value })} />
                <button type="submit">Adicionar lançamento</button>
            </form>
            <ul>
                {records.map(f => (
                  <li key={f.id} style={{ color: f.type === 'revenue' ? 'green' : 'red' }}>
                    ({new Date(f.createdAt).toLocaleString('pt-BR')}) - {new Date(f.date).toLocaleDateString('pt-BR')} - {f.type === 'revenue' ? 'Receita' : 'Despesa'} - R$ {f.value} - {f.user}
                  </li>
                ))}
                <p><strong>Saldo atual:</strong> R$ {total}</p>
            </ul>
            <button type="button" onClick={handleExportCSV}>
            Exportar como CSV
            </button>
        </div>
    );
};

export {Entry, Info};