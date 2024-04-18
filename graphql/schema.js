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
        id: String!
        email: String!
        username: String!
        age: String!
        gender: String!
        role: String!
        registrationDate: String!
    }

    type VitalSigns {
        id: String!
        nurseId: String
        username:String
        patientId: String!
        temperature: Float
        heartRate: Float
        bloodPressure: String
        respiratoryRate: Float
        updatedAt: String
        notes: String
    }

    type DailyInfo {
        id: String!
        patientId: String!
        pulseRate: Float
        bloodPressure: String
        weight: Float
        temperature: Float
        respiratoryRate: Float
        updatedOn: String
        medicationTaken: Boolean
    }

    type Symptoms {
        id: String!
        patientId: String!
        symptomsList: [String]
        createdAt: String
        severity: String
    }

    type AuthResponse {
        token: String!
        user: User!
    }

    type Query {
        getUser(id: String!): User
        getAllUsers: [User]
        getUsersByRole(role: String!): [User]
        getVitalSigns(nurseId: String!, patientId: String!): [VitalSigns]
        getPreviousVitalSigns(patientId: String!): [VitalSigns]
        generateMedicalConditions(patientId: String!): [String]
        getDailyInfo(id: String!): DailyInfo
        getSymptoms(id: String!): Symptoms
    }

    type Mutation {
        createUser(email: String!, username: String!, age: String!, gender: String!, role: String!, password: String!): User
        loginUser(email: String!, password: String!): AuthResponse
        createVitalSigns(nurseId: String!, patientId: String!, temperature: Float, heartRate: Float, bloodPressure: String, respiratoryRate: Float, notes: String): VitalSigns
        createDailyInfo(patientId: String!, pulseRate: Float, bloodPressure: String, weight: Float, temperature: Float, respiratoryRate: Float, medicationTaken: Boolean): DailyInfo
        createSymptoms(patientId: String!, symptomsList: [String]!, severity: String): Symptoms
    }
`);

// Define resolvers
const root = {
    // User resolvers
    getUser: async ({ id }) => await UserModel.findById(id),
    getAllUsers: async () => await UserModel.find(),
    getUsersByRole: async ({ role }) => {
        console.log("role", role);
        try {
          const users = await UserModel.findByRole(role);
          console.log(users);
          return users; // Make sure to return the users here
        } catch (err) {
          console.error('Error:', err);
          throw err; // Throw the error to propagate it to the frontend
        }
      },
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
        const newDailyInfo = new DailyInfoModel({ patientId, pulseRate, bloodPressure, weight, temperature, respiratoryRate, medicationTaken });
        return await newDailyInfo.save();
    },
    createSymptoms: async ({ patientId, symptomsList, severity }) => {
        const newSymptoms = new SymptomsModel({ patientId, symptomsList, severity });
        return await newSymptoms.save();
    },
};

module.exports = { schema, root };
