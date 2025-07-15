class EyeCalculator {
    constructor() {
        this.sectors = 6;
        this.variables = {};
        this.init();
    }

    init() {
        this.createDial();
        this.setupEventListeners();
        // Явное скрытие модального окна при инициализации
        document.querySelector('.input-modal').style.display = 'none';
    }

    createDial() {
        const dial = document.querySelector('.dial');
        dial.innerHTML = '';

        const angleStep = (2 * Math.PI) / this.sectors; // 60 градусов в радианах
        const numberDistance = 0.95; // 95% от размера глаза для цифр

        for (let i = 0; i < this.sectors; i++) {
            const angle = i * angleStep;

            // Сектор
            const sector = document.createElement('div');
            sector.className = 'sector';
            sector.style.transform = `rotate(${angle}rad)`;
            sector.dataset.sector = i + 1;
            dial.appendChild(sector);

            // Цифра
            const number = document.createElement('div');
            number.className = 'number';
            number.textContent = i + 1;

            // Корректировка позиции цифры
            const theta = angle + angleStep / 2 - Math.PI / 2;
            const x = Math.cos(theta) * numberDistance;
            const y = Math.sin(theta) * numberDistance;
            number.style.left = `calc(50% + ${x * 50}%)`;
            number.style.top = `calc(50% + ${y * 50}%)`;
            dial.appendChild(number);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.sector').forEach(sector => {
            sector.addEventListener('click', (e) => {
                this.showInputModal(e.target.dataset.sector);
            });
        });

        document.querySelector('.input-modal .neon-button').addEventListener('click', () => {
            this.saveVariable();
        });

        document.querySelector('.calculate-btn').addEventListener('click', () => {
            this.calculateVolume();
        });
    }

    showInputModal(sectorNum) {
        const modal = document.querySelector('.input-modal');
        modal.style.display = 'flex'; // Устанавливаем flex при открытии
        modal.dataset.currentSector = sectorNum;
        const input = document.querySelector('.variable-input');
        input.value = this.variables[sectorNum] || '';
        input.focus(); // Автофокус на поле ввода
    }

    saveVariable() {
        const modal = document.querySelector('.input-modal');
        const sectorNum = modal.dataset.currentSector;
        const value = document.querySelector('.variable-input').value;

        if (value) {
            this.variables[sectorNum] = value;
            this.updateVariablesDisplay();

            // Подсветка выбранного сектора
            document.querySelector(`.sector[data-sector="${sectorNum}"]`).classList.add('selected');
        }
        modal.style.display = 'none';
    }

    updateVariablesDisplay() {
        const display = document.querySelector('.variables-display');
        display.innerHTML = '';

        for (let i = 1; i <= this.sectors; i++) {
            const item = document.createElement('div');
            item.className = 'variable-item';
            item.innerHTML = `
                <div>Сектор ${i}</div>
                <div>${this.variables[i] ? this.variables[i] + ' мм²' : '—'}</div>
            `;
            display.appendChild(item);
        }
    }

    calculateVolume() {
        // Проверка, что все сектора заполнены
        if (Object.keys(this.variables).length < this.sectors) {
            alert('Пожалуйста, заполните значения для всех секторов.');
            return;
        }

        // Константа h
        const h = 12.57;

        // Вычисление V = h/2 * (A1 + 2A2 + 2A3 + 2A4 + 2A5 + A6)
        let sum = 0;
        for (let i = 1; i <= this.sectors; i++) {
            const value = parseFloat(this.variables[i]);
            if (isNaN(value)) {
                alert(`Некорректное значение для Сектора ${i}`);
                return;
            }
            // A1 и A6 имеют коэффициент 1, остальные — 2
            sum += (i === 1 || i === 6) ? value : 2 * value;
        }
        const V = (h / 2) * sum;

        // Отображение результата
        document.querySelector('.result-display').textContent = `Subretinal fluid volume: ${V.toFixed(2)} мм³`;

        // Сброс значений и подсветки
        this.variables = {};
        document.querySelectorAll('.sector').forEach(s => {
            s.classList.remove('selected');
        });
        this.updateVariablesDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EyeCalculator();
});