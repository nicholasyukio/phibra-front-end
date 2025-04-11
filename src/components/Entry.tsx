import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import {ptBR} from 'date-fns/locale/pt-BR';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getEntry, addEntry } from '../services/Connect';
import './Entry.css';
registerLocale('pt-BR', ptBR);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};


const Info = () => {
    return (
        <div className="info-container">
            <h1>Código-fonte do projeto:</h1>
            <p>Back-end: <a href='https://github.com/nicholasyukio/phibra-back-end' rel='noreferrer' target='_blank'>https://github.com/nicholasyukio/phibra-back-end</a></p>
            <p>Front-end: <a href='https://github.com/nicholasyukio/phibra-front-end' rel='noreferrer' target='_blank'>https://github.com/nicholasyukio/phibra-front-end</a></p>
            <p>O <b>front-end</b> foi desenvolvido com Typescript, React e Axios, com deploy feito na Vercel; o <b>back-end</b> foi desenvolvido com C#, ASP.NET, Entity Framework e SQLite, com deploy feito na Railway.</p>
            <p><i>Desenvolvido por Nicholas Yukio Menezes Sugimoto, 10 de abril de 2025</i></p>
        </div>
    )
}

const Entry = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [newRecord, setNewRecord] = useState({ date: '', type: 'revenue', value: 0, user: '' });
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const total = records.reduce((sum, r) => r.type === 'revenue' ? sum + r.value : sum - r.value, 0);
    const isMobile = useIsMobile();

    useEffect(() => {
        getEntry().then(setRecords);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!newRecord.date || !newRecord.type || !newRecord.user.trim() || isNaN(newRecord.value) || newRecord.value <= 0) {
            setStatusMessage('Por favor, preencha todos os campos corretamente.');
            setStatusType('error');
            setTimeout(() => {
                setStatusMessage('');
                setStatusType('');
            }, 3000);
            return;
        }
    
        try {
            await addEntry(newRecord);
            setRecords(await getEntry());
            setNewRecord({ date: '', type: 'revenue', value: 0, user: '' });
            setStatusMessage('Lançamento adicionado com sucesso!');
            setStatusType('success');
        } catch (error) {
            console.error(error);
            setStatusMessage('Erro ao adicionar lançamento. Verifique os dados e tente novamente.');
            setStatusType('error');
        }
    
        setTimeout(() => {
            setStatusMessage('');
            setStatusType('');
        }, 3000);
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
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.-]/g, '').slice(0, 15); // yyyyMMddThhmmss
        link.setAttribute("download", `lancamentos_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className="entry-container">
            <h1>Lançamento de Receita/Despesa</h1>
            {statusMessage && (
            <p style={{ color: statusType === 'success' ? 'green' : 'red' }}>
                {statusMessage}
            </p>
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
                {isMobile && (
                    <>
                    <label htmlFor="date">Data do evento:</label>
                    <DatePicker
                    selected={newRecord.date ? parseISO(newRecord.date) : null}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    />
                    <label htmlFor="value">Valor do lançamento (R$):</label>
                    <input
                    type="number"
                    step="0.01"
                    value={newRecord.value}
                    onChange={e => {
                        const raw = e.target.value.replace(',', '.');
                        const numeric = parseFloat(raw);
                        if (!isNaN(numeric)) {
                        const rounded = parseFloat(numeric.toFixed(2));
                        setNewRecord({ ...newRecord, value: rounded });
                        } else {
                        setNewRecord({ ...newRecord, value: 0.00 });
                        }
                    }}                  
                    style={{ appearance: 'textfield' }} // remove setas no Firefox
                    className="no-spinner" // e usa CSS pra Chrome
                    />
                    </>
                )}
                {!isMobile && (
                <div className="two-columns">
                    <div>
                        <label htmlFor="date">Data do evento:</label>
                        <DatePicker
                        selected={newRecord.date ? parseISO(newRecord.date) : null}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecione a data"
                        />
                    </div>
                    <div>
                    <label htmlFor="value">Valor do lançamento (R$):</label>
                        <input
                        type="number"
                        step="0.01"
                        value={newRecord.value}
                        onChange={e => {
                            const raw = e.target.value.replace(',', '.');
                            const numeric = parseFloat(raw);
                            if (!isNaN(numeric)) {
                            const rounded = parseFloat(numeric.toFixed(2));
                            setNewRecord({ ...newRecord, value: rounded });
                            } else {
                            setNewRecord({ ...newRecord, value: 0.00 });
                            }
                        }}                  
                        style={{ appearance: 'textfield' }} // remove setas no Firefox
                        className="no-spinner" // e usa CSS pra Chrome
                        />
                    </div>
                </div>
                )}
                <label htmlFor="user">
                Referência ({newRecord.type === 'revenue' ? 'Origem' : 'Destino'}) da {newRecord.type === 'revenue' ? 'Receita' : 'Despesa'}:
                </label>
                <input type="text" value={newRecord.user} onChange={e => setNewRecord({ ...newRecord, user: e.target.value })} />
                <button type="submit">Adicionar lançamento</button>
            </form>
            <ul>
                <li><b>Data e hora (UTC-3) de registro - Data do evento - Tipo - Valor - Referência</b></li>
                {records.map(f => (
                  <li key={f.id} style={{ color: f.type === 'revenue' ? 'green' : 'red' }}>
                    ({new Date(f.createdAt).toLocaleString('pt-BR')}) - {new Date(f.date).toLocaleDateString('pt-BR')} - {f.type === 'revenue' ? 'Receita' : 'Despesa'} - R$ {f.value.toFixed(2)} - {f.user}
                  </li>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p><strong>Saldo atual:</strong> R$ {total.toFixed(2)}</p>
                <button type="button" onClick={handleExportCSV}>
                    Exportar como CSV
                </button>
                </div>
            </ul>
        </div>
    );
};

export {Entry, Info};