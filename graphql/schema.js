const { buildSchema } = require('graphql');
const UserModel = require('../models/UserModel');
const VitalSignsModel = require('../models/VitalSignsModel');
const DailyInfoModel = require('../models/DailyInfoModel');
const SymptomsModel = require('../models/SymptomsModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; 

// Define GraphQL schema
const schema = buildSchema(`
    type User {
        id: ID!
        email: String!
        username: String!
        age: String!
        gender: String!
        role: String!
        registrationDate: String!
    }

    type VitalSigns {
        id: ID!
        nurseId: ID!
        patientId: ID!
        temperature: Float
        heartRate: Float
        bloodPressure: String
        respiratoryRate: Float
        updatedAt: String
        notes: String
    }

    type DailyInfo {
        id: ID!
        patientId: ID!
        pulseRate: Float
        bloodPressure: String
        weight: Float
        temperature: Float
        respiratoryRate: Float
        updatedOn: String
        medicationTaken: Boolean
    }

    type Symptoms {
        id: ID!
        patientId: ID!
        symptomsList: [String]
        createdAt: String
        severity: String
    }

    type AuthResponse {
        token: String!
        user: User!
    }

    type Query {
        getUser(id: ID!): User
        getAllUsers: [User]
        getVitalSigns(nurseId: ID!, patientId: ID!): [VitalSigns]
        getPreviousVitalSigns(patientId: ID!): [VitalSigns]
        generateMedicalConditions(patientId: ID!): [String]
        getDailyInfo(id: ID!): DailyInfo
        getSymptoms(id: ID!): Symptoms
    }

    type Mutation {
        createUser(email: String!, username: String!, age: String!, gender: String!, role: String!, password: String!): User
        loginUser(email: String!, password: String!): AuthResponse
        createVitalSigns(nurseId: ID!, patientId: ID!, temperature: Float, heartRate: Float, bloodPressure: String, respiratoryRate: Float, notes: String): VitalSigns
        createDailyInfo(patientId: ID!, pulseRate: Float, bloodPressure: String, weight: Float, temperature: Float, respiratoryRate: Float, medicationTaken: Boolean): DailyInfo
        createSymptoms(patientId: ID!, symptomsList: [String]!, severity: String): Symptoms
    }
`);

// Define resolvers
const root = {
    // User resolvers
    getUser: async ({ id }) => await UserModel.findById(id),
    getAllUsers: async () => await UserModel.find(),
    // VitalSigns resolvers
    getVitalSigns: async ({ nurseId, patientId }) => await VitalSignsModel.find({ nurseId, patientId }),
    getPreviousVitalSigns: async ({ patientId }) => await VitalSignsModel.find({ patientId }),
    generateMedicalConditions: async ({ patientId }) => {
        // Your deep learning logic to generate medical conditions goes here
        // This is a placeholder, replace it with actual logic
        return ["Fever", "Cold", "Flu"];
    },
    // DailyInfo resolvers
    getDailyInfo: async ({ id }) => await DailyInfoModel.findById(id),
    // Symptoms resolvers
    getSymptoms: async ({ id }) => await SymptomsModel.findById(id),
    // Mutation resolvers
    createUser: async ({ email, username,password, age, gender, role,  }) => {
        //const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ email, username, age, gender, password: password, role });
        return await newUser.save();
    },
    loginUser: async ({ email, password }) => {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        
        const isAuth = await bcrypt.compare(password, user.password); // Use bcrypt.compare to check the password
        if (!isAuth) {
            throw new Error('Incorrect password');
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    },
    createVitalSigns: async ({ nurseId, patientId, temperature, heartRate, bloodPressure, respiratoryRate, notes }) => {
        const newVitalSigns = new VitalSignsModel({ nurseId, patientId, temperature, heartRate, bloodPressure, respiratoryRate, notes });
        return await newVitalSigns.save();
    },
    createDailyInfo: async ({ patientId, pulseRate, bloodPressure, weight, temperature, respiratoryRate, medicationTaken }) => {
        try {
            // Parse float values from the input to ensure correct data types are saved
            const newDailyInfo = new DailyInfoModel({
                patientId,
                pulseRate: parseFloat(pulseRate),
                bloodPressure,
                weight: parseFloat(weight),
                temperature: parseFloat(temperature),
                respiratoryRate: parseFloat(respiratoryRate),
                medicationTaken
            });
            return await newDailyInfo.save();
        } catch (error) {
            console.error("Error saving daily info:", error);
            throw new Error('Failed to save daily information');
        }
    },
    ccreateSymptoms: async ({ patientId, symptomsList, severity }) => {
        try {
            const newSymptoms = new SymptomsModel({ patientId, symptomsList, severity });
            const savedSymptoms = await newSymptoms.save();
    
            // Log the saved symptoms to the console to debug and verify their structure
            console.log('Saved Symptoms:', savedSymptoms);
    
            if (!savedSymptoms) {
                throw new Error('Creation of symptoms failed');
            }
    
            return savedSymptoms;  // This should include the auto-generated ID and other properties
        } catch (error) {
            throw new Error('Failed to save symptoms: ' + error.message);
        }
    },  
    
};

module.exports = { schema, root };
